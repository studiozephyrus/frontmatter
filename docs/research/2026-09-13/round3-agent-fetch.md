# How each coding agent consumes a kickoff prompt with an unlisted-link curl

Date: 2026-09-13. All figures below were opened in this run with curl; see "Sources"
at the end for exact URLs. Local corpus (`docs/research/`) was grepped first, nothing
there covers agent network-permission behaviour, so this is fresh research.

## 1. Claude Code

**Bash tool (curl).** Bash commands ask for approval by default, "except a built-in
set of read-only commands" (curl is not read-only, so a bare `curl <url>` prompts the
first time; the user can approve once and save a per-repository, per-command rule, or
answer "Yes, and don't ask again" to persist it to `.claude/settings.local.json`).
Source: `code.claude.com/docs/en/permissions.md`, permission-system table and
"Yes, and don't ask again" paragraph.

**Sandbox mode (if enabled).** If the user has the OS-level Bash sandbox on, curl to a
domain already on `sandbox.network.allowedDomains` runs with no prompt at all; the
first time a command needs a new domain not on the list, Claude Code prompts for
approval (or in auto mode sends it to a classifier). Source: `code.claude.com/docs/en/sandboxing.md`
line 43 ("The first time a command needs a new network domain, Claude Code prompts for
approval").

**WebFetch tool.** Separately from Bash/curl, Claude Code has a dedicated `WebFetch`
tool. It also asks for permission by default, "except ... a built-in set of preapproved
documentation domains that fetch without a prompt" (e.g. common docs sites). A `WebFetch(domain:x)`
allow rule can be saved permanently per repository + domain. Source:
`code.claude.com/docs/en/permissions.md` table, and `tools-reference.md` §"WebFetch tool
behaviour".

**Size / processing limits on WebFetch.** WebFetch converts HTML to Markdown, runs a
small extraction model over it, and returns that model's answer, not the raw page
("This makes WebFetch lossy by design"). "Large pages are truncated to a fixed
character limit before processing", no exact byte/character number is published on
this page, so treat the exact cutoff as UNVERIFIED. A fetch that doesn't finish
downloading within 5 minutes (including redirects) fails with a deadline error. A
redirect to a different host is NOT followed automatically, WebFetch returns a text
result naming the original URL and the redirect target, and Claude has to issue a
second WebFetch call to the new URL. Source: `tools-reference.md` §538-551.

**Privacy, what Anthropic's servers see when WebFetch runs.** Before fetching,
WebFetch sends the requested hostname (only the hostname, not the full URL, path, or
page contents) to `api.anthropic.com` for a safety-blocklist check. This runs
regardless of model provider (even on Bedrock/Vertex/Foundry) and is on by default;
it can be turned off with `skipWebFetchPreflight: true`. Source: `code.claude.com/docs/en/data-usage.md`
§"WebFetch domain safety check".

**Data retention (general, not WebFetch-specific).** Consumer accounts: 30-day
retention if the user opted out of model-improvement data use, 5-year if opted in.
API/Enterprise: 30-day standard retention, or Zero Data Retention on qualified
Enterprise accounts. Session transcripts are also cached locally in plaintext under
`~/.claude/projects/` for 30 days by default. Source: `code.claude.com/docs/en/data-usage.md`
§"Data retention".

**Net effect for our kickoff prompt:** if we tell the agent to `curl` the kit, on a
fresh Claude Code session (no sandbox, no prior approval) the user sees ONE permission
prompt for that specific curl command the first time, then can allow it permanently for
that repo. If we instead phrase the instruction to use "fetch" language, Claude Code
may route it through WebFetch, which also prompts once per domain, but ALSO
lossy-summarises the fetched content through a small model before Claude ever sees the
raw JSON/checksums, bad for a kit that must be byte-exact. **The kickoff prompt should
explicitly say "use curl (Bash tool), not a browse/fetch tool" so the kit's raw bytes
and SHA-256 lines reach the agent unprocessed.**

## 2. Cursor

**Terminal / Shell tool.** Cursor's Agent has configurable "Run Modes" for tool calls
(interactive approval vs. an allowlist vs. auto-run). Shell command rules use the same
`Shell(command:*)` glob syntax shown in Cursor's docs, e.g. `Shell(curl:*)` to allow curl
with any arguments; without such a rule, shell commands prompt for approval under
default/interactive run modes. Source: `cursor.com/docs/agent/tools/terminal`,
`cursor.com/docs/agent/security/run-modes`.

**Network sandbox default.** Cursor's sandbox description states plainly: "Network:
Blocked by default, then opened by your network mode and sandbox.json." So even when a
shell command is allowed to run, its network egress is blocked unless the network mode
/ `sandbox.json` explicitly opens it. Source: `cursor.com/docs/agent/tools/terminal`
(Filesystem/Network/Temporary-files table).

**Web-fetch tool.** Cursor has its own `WebFetch`-style tool for retrieving docs/pages,
gated the same way as Claude Code's: "Without an allowlist entry, each fetch prompts
for approval." Rules use `WebFetch(docs.github.com)`, `WebFetch(*.example.com)`,
`WebFetch(*)` (any domain, "use with caution"). Source: `cursor.com/docs/cli/reference/permissions`.

**Cloud Agents (background/async Cursor agents, not the local IDE agent)** have a
separate, coarser network setting: "Allow all network access" or "Default + allowlist".
Source: `cursor.com/docs/cloud-agent/network-access` (per WebSearch summary, page title
confirms this exists; not separately opened by curl in this run because the local-agent
behaviour above already answers the question for our funnel's target audience).

**Net effect:** same shape as Claude Code, curl needs an explicit allow rule or a
per-call approval, and even then network egress from that shell command is blocked
unless the sandbox/network mode is opened for it. **The kickoff prompt should tell the
user (not just the agent) to check Cursor's Run Mode / network setting once, since a
locked-down default install may refuse the curl silently rather than prompting.**

## 3. OpenAI Codex (CLI and cloud)

This is the one vendor whose default is qualitatively different: **network access is
off, not "ask", by default**, in both places Codex runs.

**Codex CLI / IDE extension (local).** "By default, the agent runs with network access
turned off." The default sandbox mode is `workspace-write`, which "keeps network access
turned off unless you enable it in your configuration" via
`[sandbox_workspace_write] network_access = true` in `~/.codex/config.toml` (or the
equivalent `-c` override). In the interactive "Auto" preset, Codex can read/edit/run
commands in the workspace automatically, but STILL "asks for approval to ... run
commands that require network access", i.e. even with Auto mode on, a `curl` inside
the workspace triggers an approval prompt rather than running silently, unless
`network_access` was pre-enabled in config. Source:
`developers.openai.com/codex/agent-approvals-security`, §"Agent approvals & security"
and §"Network access".

**Codex cloud.** Runs in isolated OpenAI-managed containers with a two-phase model:
the SETUP phase can reach the network to install dependencies, then the AGENT phase
"runs offline by default unless you enable internet access for that environment", and
when enabled, that's via a domain allow list configured per-environment (not a per-call
prompt, since there's no human watching a cloud run in real time). Source: same page,
§"Sandbox and approvals" / "Network access", cross-referencing "agent internet access
to enable full internet access or a domain allow list" for Codex cloud.

**Net effect, this is the one that breaks a naive kickoff prompt.** If the user's
Codex is running with the stock CLI defaults, `curl <unlisted-link>` will either be
BLOCKED outright (network access off, no prompt at all if approval_policy is
`on-failure`/read-only-ish) or will pause for one approval (if `on-request` and network
was left disabled), but it will never silently succeed the way it can in Claude Code
or Cursor. For Codex cloud specifically, the user has to have already turned on
internet access (or a domain allow-list including the frontmatter kit host) for that
cloud environment BEFORE kicking off the job, because there's no interactive approval
step mid-run. **The kickoff prompt needs an explicit preflight line for Codex users:
"If you're on Codex CLI, run `codex --sandbox workspace-write -c
sandbox_workspace_write.network_access=true`, or approve the network request when
asked; if you're on Codex cloud, add `<our-domain>` to the environment's internet
access allow-list before starting."**

## 4. GitHub Copilot coding agent

Copilot's coding agent runs inside a GitHub Actions-based sandbox with a **firewall
that is on by default**, not a per-call prompt. "The Copilot cloud agent includes a
built-in firewall with a recommended allowlist that is enabled by default," which
mainly allows OS package repos and container registries. A repository admin can go to
the "Coding agent" settings page to add custom hosts to the allowlist, or turn off the
recommended default list for a more locked-down configuration. Source:
`docs.github.com/en/copilot/how-tos/agents/copilot-coding-agent/customizing-or-disabling-the-firewall-for-copilot-coding-agent`.

**Scope limits (important for us):** "The firewall only applies to processes started by
the agent via its Bash tool. It does not apply to Model Context Protocol (MCP) servers
or processes started in configured Copilot setup steps," and "The firewall only
operates within the GitHub Actions appliance environment. It does not apply to
processes running outside of this environment." If the request is blocked, Copilot
doesn't just fail silently, "a warning is added to the pull request body ... showing
the blocked address and the command that tried to make the request," so the human
reviewing the PR sees the failed curl.

**Net effect:** unlike the other three, there's no interactive human in the loop to
approve a one-off curl mid-session, Copilot's coding agent works from a PR, not a
live terminal. So a curl to our unlisted kit URL will be silently blocked unless a repo
admin has pre-added our domain to the firewall allowlist (or disabled the firewall).
**Copilot users need the domain named explicitly, in writing, as a one-time repo
setting they must add before the agent can fetch the kit**, the kickoff prompt cannot
fix this at prompt-time the way it can nudge a human through an interactive approval in
the other three tools.

## Privacy: what each vendor sees when the agent fetches the unlisted link

| Vendor | What's confirmed from primary docs |
|---|---|
| Claude Code | Only the **hostname** (not path, query string, or content) is sent to `api.anthropic.com` for the WebFetch safety check, cached 5 minutes; the check is on by default, off via `skipWebFetchPreflight`. If curl runs via Bash instead of WebFetch, no equivalent preflight call happens, the request goes straight from the user's/agent's machine to our server. Fetched-page *content* retention wasn't separately documented on the WebFetch page; general session-data retention (30 days / 5 years by data-use choice, or ZDR on qualified Enterprise) applies to whatever ends up in the transcript. |
| Cursor | Not independently verified in this run beyond the general "each fetch prompts for approval" / allowlist mechanism; Cursor's own network-access and security-network pages (`cursor.com/docs/cloud-agent/security-network`, `cursor.com/docs/cloud-agent/network-access`) were found by search but not opened by curl in this pass, mark vendor-retention-of-fetched-content claims for Cursor as **UNVERIFIED**. |
| OpenAI Codex | Not independently verified in this run for what OpenAI's cloud-agent infrastructure logs/retains about URLs an agent fetches, mark **UNVERIFIED**; the security page opened covers sandboxing/approvals, not data retention of fetched content. |
| GitHub Copilot | The firewall page describes what's blocked/allowed and that a blocked attempt is shown in the PR body/comment (visible to the repo, not just to GitHub), this means our unlisted link, if blocked, gets its URL surfaced in a PR comment. Not separately verified: whether GitHub's own infrastructure logs the destination of successful (allowed) outbound requests from the coding agent sandbox. Mark as **UNVERIFIED** beyond the blocked-request case. |

Given three of four vendor privacy-retention questions are UNVERIFIED in this pass
(time-boxed to 15 sources), the honest framing for the plan is: **assume the vendor's
infrastructure can see the unlisted URL in transit** (true for all four, since the
fetch has to leave through the vendor's sandbox/proxy in three of the four cases), and
do not rely on the link being invisible to the vendor, the "unlisted" property only
protects it from public search/crawling, not from the coding-agent vendor whose
infrastructure the fetch runs through.

## Firestore Standard edition pricing (verified 2026-09-13)

Source: `cloud.google.com/firestore/pricing`, the interactive per-location pricing
table. Confirmed by finding the literal `$0.06`, `$0.18`, `$0.02` strings tied to the
"Document Reads" / "Document Writes" / "Document Deletes" / "Stored Data" row labels
in the page's data payload (this is the standard, non-discounted rate that recurs
across most listed regions, including the classic `us-central1` / `nam5` baseline;
some regions show a discounted variant, e.g. reads $0.048, writes $0.144, deletes
$0.016, storage $0.117 per GiB):

| Metric | Rate |
|---|---|
| Document reads | $0.06 per 100,000 |
| Document writes | $0.18 per 100,000 |
| Document deletes | $0.02 per 100,000 |
| Stored data | $0.18 per GiB per month |

Free tier (from `firebase.google.com/docs/firestore/pricing`, opened same date):
50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, 1 GiB storage, 10 GiB/month
outbound transfer, free tier applies to only one database per project.

**For the plan's cost section:** use $0.06 / $0.18 / $0.02 per 100,000
reads/writes/deletes and $0.18/GiB-month as the Standard-edition baseline, and note
that exact per-region rates vary (cheaper in some regions, unchanged in most North
America/Europe regions), re-derive at write time if the plan later pins a specific
Firestore location other than the default multi-region.

## Kickoff-prompt changes the MVP plan needs

1. **Tell the agent explicitly to use `curl`, not a generic "fetch/browse this URL"
   instruction.** In Claude Code this keeps the raw kit bytes and SHA-256 lines out of
   the lossy WebFetch summarisation path; in the other three tools "fetch" and "curl"
   both eventually go through a shell/network layer anyway, so being explicit removes
   ambiguity about which tool the agent should reach for.
2. **Add one preflight sentence per vendor**, since none of the four let a bare
   `curl <unlisted-link>` succeed with zero setup and zero possible friction:
   - Claude Code / Cursor: "Approve the network request when your tool asks, this is
     expected, not an error."
   - Codex CLI: "If the curl is blocked or nothing happens, your Codex sandbox has
     network access off by default; re-run with network access enabled or approve the
     prompt if one appears."
   - Codex cloud / GitHub Copilot coding agent: these need PRE-AUTHORISATION, not an
     in-session approval, there is no human watching a live terminal. Tell the user,
     in the product UI (not just the kickoff prompt), to allow-list our domain in the
     Codex cloud environment's internet-access setting, or the GitHub repo's Copilot
     coding-agent firewall settings, before starting the job. A prompt-only fix cannot
     reach these two, because the fetch is refused before the agent ever gets to try
     the instruction we wrote.
3. **Do not promise the link is invisible to the vendor.** All four vendors' agents
   fetch through vendor-controlled infrastructure (sandbox proxy, cloud container, or
   GitHub Actions appliance) at least some of the time, so the unlisted link should be
   described to users as "unlisted, not secret", consistent with the product's Free
   tier being "unlisted public link" rather than authenticated.
4. **State a checksum-verification fallback line** for GitHub Copilot specifically,
   since a blocked fetch surfaces the failed URL in a PR comment rather than failing
   silently to the user in real time, the kickoff prompt should tell the agent "if the
   curl is blocked, say so in the PR and stop" rather than guessing or proceeding
   without the kit.

## Sources opened by curl (2026-09-13)

- Claude Code permissions, https://code.claude.com/docs/en/permissions.md
- Claude Code tools reference (WebFetch behaviour), https://code.claude.com/docs/en/tools-reference.md
- Claude Code sandboxing, https://code.claude.com/docs/en/sandboxing.md
- Claude Code data usage / retention, https://code.claude.com/docs/en/data-usage.md
- Claude Code network config (proxy/CA, read but not directly cited above), https://code.claude.com/docs/en/network-config.md
- Cursor terminal tool docs, https://cursor.com/docs/agent/tools/terminal
- Cursor run modes, https://cursor.com/docs/agent/security/run-modes
- Cursor CLI permissions reference, https://cursor.com/docs/cli/reference/permissions
- OpenAI Codex agent approvals & security, https://developers.openai.com/codex/agent-approvals-security
- GitHub Copilot coding agent firewall customization, https://docs.github.com/en/copilot/how-tos/agents/copilot-coding-agent/customizing-or-disabling-the-firewall-for-copilot-coding-agent
- Google Cloud Firestore pricing (data payload), https://cloud.google.com/firestore/pricing
- Firebase Firestore pricing / free-tier table, https://firebase.google.com/docs/firestore/pricing

Not independently opened this run (found via WebSearch only, flagged above as
UNVERIFIED where the plan would otherwise rely on them): Cursor cloud-agent network
access page, Cursor cloud-agent security/network page, OpenAI Codex cloud
internet-access page (URL guessed and returned a generic nav shell, not the target
content, do not treat anything from that fetch as sourced).
