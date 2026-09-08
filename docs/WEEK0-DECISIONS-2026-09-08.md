---
updated: 2026-09-08
status: drafts of the two week-0 pages the plan requires — for the founders to accept or change
tier: 0
---

# Week-0 decisions, drafted

Two pages the plan (v14 §14, week 0) requires before anything is built. Both are drafted here so the meeting decides text, not whether to write it.

## 1. The measurement decision — how "6 of 10 strangers keep it" is observed

**Constraint.** frontmatter holds no document bytes and runs no vendor usage database (v14 §22). Obsidian, with the same architecture, states on record that it cannot see churn. So the MVP-0 exit test is unobservable unless measurement is designed in, and the only design compatible with the operating rules is opt-in, local, and readable by the user.

**Decision, proposed.**

| | |
|---|---|
| What is counted | Days on which the app was opened; documents opened; spans reviewed (accept, revert, skip); proposals accepted from the docs scan; questions answered in place. Counts only, no content, no file names, no prompts |
| Where it lives | `.frontmatter/usage.jsonl` in the user's repo, one JSON line per day, plain text. The user can open, edit or delete it. It is in their repo, so they own it |
| How it reaches us | It does not, by default. During the pilot each stranger is asked, once, at the end of week two, to paste the file into a message or to say no. Ten files, read by a person |
| The exit measure | A stranger "keeps it" if the file shows the app opened on at least 6 of the last 10 working days of the pilot and at least one review action in the second week. Six of ten strangers meeting that is the gate |
| What is never collected | Session replay, keystrokes, document content, file names, prompts, IP, device identifiers |
| At scale | The same file, plus an explicit opt-in toggle in Settings ("share usage counts") that uploads the daily line to the control plane keyed to the account. Off by default. DPDP: this is personal data once keyed to an account, so it falls under the notice-and-consent duties in the operating rules |
| What this cannot tell us | Why someone stopped. That comes from asking, not from counting |

**Fallback if the founders reject local files.** Ask each of the ten strangers, on day 14, one question by message: "Did you open it this week, and what did you do in it?" — and accept that the gate is then self-reported.

## 2. The web byte path — where document bytes travel in the web app

**Constraint.** The plan promises "zero document bytes in our control plane" (v14 §4). That is true of the desktop app by construction. For the web app it is true only if the byte path is designed so, and no one has written the path down.

**Facts in hand.** `api.github.com` supports CORS, so a browser can fetch a repository's contents with the user's own token (verified 2026-09-08). The File System Access API lets a page open a local folder without any install on desktop Chrome and Edge, and on no other browser (caniuse, 2026-09-08). The GitHub App installation flow issues installation tokens scoped to selected repositories, expiring in one hour.

**Decision, proposed: browser-side only. No document byte ever passes through a Zephyrus server.**

| Path | How | What our server sees |
|---|---|---|
| GitHub repository, read | The browser calls `api.github.com` directly with a token minted for the user's installation. Content responses go browser → engine in the page | The token exchange only: our server exchanges the GitHub App's private key for an installation token and returns it to the browser. It never proxies content |
| GitHub repository, write | The browser creates the commit via the Git Data API (blobs, trees, commits, refs) or a PR, directly against GitHub | Nothing. A commit made from the browser with the user's token |
| Local folder, Chrome and Edge | File System Access API; a directory handle with a permission prompt, persisted for the origin | Nothing. The bytes never leave the machine |
| Drag-and-drop, any browser | Files read in the page for the session; not persisted | Nothing |
| Review sidecar | Written alongside the documents by the same path as the documents | Nothing |
| Search | Client-side index over the open vault for the web app (the 77 MB cold-start problem is solved by indexing lazily per file, not by a server index) | Nothing |
| AI | Browser → the user's provider with the user's key. CORS is provider-specific: Anthropic's API allows browser calls with an explicit header, others may not; each provider is checked, and one that refuses browser calls is unavailable in the web app rather than proxied | Nothing |

**Consequences to accept.**

- The control plane holds: account identity, team membership, entitlements, billing, and the GitHub App installation id. Nothing else.
- Server-side full-text search is therefore off the table for the web app; the plan's §9 line "move to server full-text" must change to "index per open file in the client".
- Hosted AI (Max, optional) is the one path that would carry prompt text through a Zephyrus server. It stays off by default and, when on, the byte that passes is the prompt and the selection, never the vault.
- Very large repositories are limited by browser memory; the web app is the trial, the desktop app is the daily surface, and the plan already says so.

**One check before it is final.** Confirm that the GitHub App can be configured so the installation-token exchange returns the token to the browser without the server ever calling the contents API — this is a configuration and code review, half a day.

## 3. Also open for the founders, not drafted here

The name (Front Matter CMS holds "Front Matter" in the VS Code Marketplace); the F5/F6/F7 user-test notes; whether sgnk-md has users who can be interviewed; decision 2 (which buyer first); decision 3 (Share: hosted viewer or permalink plus export).
