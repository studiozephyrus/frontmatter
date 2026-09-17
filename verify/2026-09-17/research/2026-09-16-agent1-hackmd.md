# HackMD (hackmd.io): verified profile, fetched 2026-09-16

Every page cited was opened with curl on 2026-09-16; quoted strings are verbatim. Raw HTML of every page is cached at `/tmp/claude-501/hackmd/`. WebFetch was not used.

## 1. Since when; the CodiMD/HedgeDoc split; legal entity

- Origin: "In 2014, while completing his master's degree, Max Wu was searching for a secure way to collaborate and document in Markdown." Team: "Jong-kai Yang, Chief Executive Officer and Co-Founder"; "Max Wu, Chief Technology Officer and Co-Founder". Investors listed: "Vitalik Buterin", "Techstars", "SevenX Ventures", "AngelList", "Global Coin Research" (https://hackmd.io/about).
- HedgeDoc's timeline: "May '15 The first commit in the history of HackMD is made." "July '15 The public instance hackmd.io goes online." "October '17 HackMD is split into HackMD CE and HackMD EE." "June '18 The community renames HackMD CE to CodiMD to avoid name confusion." The EE team "proposes to replace the community-code of CodiMD with their rewrite of HackMD EE by switching to an open-core model" under Apache 2.0; "The community wants to keep their code and the AGPLv3 license" and "creates a hard fork of CodiMD into their own GitHub organisation". "July '20 The community chooses "HedgeDoc" as the new name." "December '20 The community publishes HedgeDoc 1.7" (https://hedgedoc.org/history/).
- GitHub API: `hackmdio/codimd` created_at `2015-05-04T06:06:45Z`, stargazers_count 10143, pushed_at `2025-10-02T02:51:07Z`, archived false (https://api.github.com/repos/hackmdio/codimd). `hedgedoc/hedgedoc` created_at `2019-03-27T12:14:01Z`, stargazers_count 7423, pushed_at `2026-09-15T20:03:54Z`, archived false (https://api.github.com/repos/hedgedoc/hedgedoc). Org `hackmdio` created_at `2015-07-30T15:29:13Z`, location "Taipei, Taiwan", public_repos 82 (https://api.github.com/orgs/hackmdio).
- Release notes reach back to "0.2.1 `spark` 2015-03-17 13:40"; the "0.3.2 `typhoon` 2015-07-11" entry lists "Support operational transformation" (https://hackmd.io/c/release-notes).
- Legal: the terms bind you to "HackMD, Inc."; "governed by and construed in accordance with the laws of State of Delaware"; courts "located in New Castle, Delaware"; "Effective: October 15, 2019." (https://hackmd.io/s/terms). Privacy policy: "Effective as from May 30, 2016." (https://hackmd.io/s/privacy). No street address on either page.
- Wikipedia: the API returned no page for HedgeDoc, CodiMD or HackMD; https://en.wikipedia.org/wiki/HedgeDoc gave 404.

## 2. What they are building now

Homepage positioning: "Where teams and agents build together"; "the shared context layer that keeps your team and your agents in sync"; "Works with Claude Code, Cursor, GitHub Actions, OpenAI, and any tool that speaks Markdown." (https://hackmd.io/)

- Real-time collaboration: "Real-time editing with multiple cursors, comments, version history, and GitHub sync." (home). Engine hints: "Support operational transformation" (2015-07-11), "previous OT mechanism" (EE 1.51.2, 2023-03-28), and "Fix folder yjs room handling and persistent fallback" (EE 1.84.3, 2025-12-04) (release notes).
- GitHub push/pull: "You can sync your note from the editor of an empty note, or from the Versions and GitHub Sync panel. Then, choose the version you want to Push or Pull." "The free plan can be used 20 times per month" (https://hackmd.io/@docs/sync-a-note-with-github). "GitLab integration" is Enterprise-only (pricing).
- Book and slide modes: "You can make your notes into a book." "You can use a special syntax to organize your note into slides." (https://hackmd.io/s/features)
- Templates: "Create a note from template", "Save as template"; "If you want to use template for styling (using HTML `<style>`), embedding the template might be the better way." (https://hackmd.io/@docs/how-to-use-template-en)
- Tags (`###### tags:`), `[TOC]`, YAML metadata (s/features); "Paragraph bookmark", "Guided comment", "Paragraph Citations", "Webhooks Guide" (https://hackmd.io/c/tutorials); "Suggest edit New", "In-line and page commenting" (pricing); "Emoji Reply" (in-app strings at https://hackmd.io/features).
- Version history: "Recent 10 versions" free, "Unlimited" on Prime (pricing); "Versions API" shipped "Sep 8, 2026" (https://hackmd.io/changelog).
- Note Insights: "understand readers' reactions and interests"; metrics "Views", "Engaged Views", "Engagement", "Contribution" (https://hackmd.io/sGiA3CU3RoKtjnAkH6S6Fw/publish).
- Teams: "Public Teams can have unlimited members (3 for free and charged per seat after that)." (pricing FAQ)
- API: Swagger at https://api.hackmd.io/v1/docs (https://hackmd.io/@docs/developer-portal); "Already powering over 1M+ API calls"; "Agent gets Markdown via Accept: text/markdown" (home).
- MCP: "HackMD provides a remote Model Context Protocol (MCP) server at `https://mcp.hackmd.io/`", OAuth 2.1; its `update-note` tool is described as "Overwrite the content of an existing note." (https://hackmd.io/@docs/mcp-server-setup). First MCP release-note entry: EE 1.85.1, 2026-01-28.
- Agent skills: "Official HackMD agent skills for Claude Code, Cursor, Codex, and compatible harnesses." (https://raw.githubusercontent.com/hackmdio/hackmd-skills/main/README.md)
- CLI: `@hackmd/hackmd-cli` latest 2.5.1, modified 2026-08-26 (https://registry.npmjs.org/@hackmd/hackmd-cli).
- VS Code: "23,917 installs", version "2.1.0", lastUpdated "Fri, 03 Mar 2023" (https://marketplace.visualstudio.com/items?itemName=HackMD.vscode-hackmd).
- Browser extensions: "HackMD-it" and "Web Clipper to HackMD" (https://chromewebstore.google.com/search/hackmd).
- Community: "HackMD Community turns published notes into a shared space", "Jul 8, 2026" (changelog); page exists at https://hackmd.io/community.
- Publishing and embeds: "Customize permalink to your note" (pricing); "Notes can be embedded using iframe" (s/features).
- AI: "Prepare to have AI-generated metadata to help organize and describe notes" and "Add a user setting to manage AI consent preferences" (EE 1.85.0, 2026-01-21, release notes). No AI writing or summarising feature is described on any page opened.
- "Scribe": zero occurrences of "Scribe" in every page fetched (home, pricing, about, enterprise, features, tutorials, developer portal, blog index, changelog, and all 405 release-note entries); seven URL guesses returned 404; a web search surfaced only the unrelated company Scribe. What the founder saw is UNVERIFIED; the "feature preview" help page returned 403 (login required), so it may be a gated preview.
- Themes: "Dark Mode", "Custom CSS" (tutorials). Offline: "does not currently support a full offline mode" (https://hackmd.io/@docs/offline-access-en). Self-hosting: "Self-hosting" is an Enterprise row (pricing); "on-premises deployment, and managed hosting" (https://hackmd.io/enterprise). Desktop: terms mention "HackMD desktop clients"; repo `hackmd-desktop` last pushed 2023-01-04 (org API).

## 3. Pricing (https://hackmd.io/pricing)

- Free: "$ 0", "Free forever", "Up to 3 teammate", "Unlimited notes", "3 invitees", "3 custom templates", "Suggest edit", "GitHub integration", "20 GitHub pushes per month", "Customize permalink to your note", "Upload up to 1MB per image"; comparison table adds "Recent 10 versions", "Trash can timeframe 3 days", "400 calls / month" API.
- Team Prime: "$ 5 per seat/mo", "Total $15 /month Billed annually", "Save 37.5%". The page's JS constants are `price: 8, yearlyPrice: 5` (so $8 monthly, $5 yearly; 5/8 = 62.5%, hence 37.5% saved). Adds "Full-text search", "Upload up to 20MB per image", "PDF export", "Unlimited invites", "Unlimited versions", "Unlimited GitHub pushes", "Unlimited custom templates", "20K API calls per month", "Note insights".
- Personal Prime: constants `price: 6, yearlyPrice: 4`; help page: "Upgrading your personal workspace currently only costs $6 per user per month. Choosing an annual payment costs $4 per month ($48 per year)." (https://hackmd.io/@docs/Personal-Prime-subscription-management-en). This is the "$48 USD yearly" the founder saw.
- Enterprise: "Request a demo"; "Role-based access control", "SSO (SAML, LDAP, customized) login", "Custom domain", "Custom homepage", "GitLab integration", "Custom payment methods", "Dedicated account manager"; API "Unlimited".
- Lapse: "when the Prime subscription expires, the workspace and the notes in it will become read-only." Non-profits: "sponsor your mission with a Prime Team plan."

## 4. How strong a competitor

- Scale claims: "1,000,000+ people around the world build with HackMD"; "1m Users", "30k Teams", "170 Countries represented", "7.7m Notes created" (about, home). "SOC 2 CERTIFIED" footer; "HackMD is now SOC 2 Type II compliant" post dated "Jun 10, 2026" (https://hackmd.io/blog).
- Shipping cadence: newest release "EE 1.89.2 2026-09-14 23:28"; 405 entries on the page; counted by script per year: 2019: 45, 2020: 52, 2021: 45, 2022: 44, 2023: 50, 2024: 60, 2025: 44, 2026: 27 through 14 Sep (release notes). Newest blog post "Sep 9, 2026", "The HackMD Versions API is now live"; changelog entries "Sep 8, 2026", "Jul 8, 2026", "May 18, 2026", "May 11, 2026".
- Logos on the homepage (image alt text): Arweave, Avalanche, Base, Blockfuse, Bokeh, Brown, Continuous Foundation, DevOpsDays, ETH, GenerativeAI, Lido, Rust, SciPy, SITCON, Slice, The Mee Foundation, Updraft, BrightID, g0v, OpenJS Foundation. Quoted customers: "Founder of HashCloak and Stoffel Labs", "CEO of BlockFuse Labs", "Co-founder of Kiwi News".
- Open-source lineage stars: codimd 10,143; hedgedoc 7,423; hackmd-desktop 329; hackmd-cli 176; vscode-hackmd 175 (GitHub API).
- App Store: the iTunes search API for "hackmd" returned 9 apps, none by HackMD (https://itunes.apple.com/search?term=hackmd&entity=software).
- Similarweb: HTTP 202 with an empty body, not opened.

## 5. Onboarding

- Sign-in: "You can log in to HackMD through multiple platforms, including Facebook, Google, X (Twitter), Github, Dropbox, and more." (https://hackmd.io/@docs/registration_and_binding_en)
- Guests: the app config at https://hackmd.io/features contains `window.ALLOW_ANONYMOUS = true` and `window.ALLOW_ANONYMOUS_EDIT = false`; tooltip "Sign in to create, share, and comment on a note". Pricing FAQ: "Anyone can read your public documentation. All they need is the link to access. If they'd like to comment on or suggest edits to your notes, then they need a HackMD account."
- Bot protection: `curl -sI` on https://hackmd.io/join and https://hackmd.io/login returned `HTTP/2 202`, `server: awselb/2.0`, `x-amzn-waf-action: challenge`, which is an AWS WAF challenge and matches the founder's "confirm you are human" screen (a note URL and /new returned 200 to a HEAD request). Release notes: "Set a stricter recaptcha score for sign-up process" (EE 1.44.4, 2022-09-22); "Upgrade to reCAPTCHA Enterprise API and use checkbox in some cases"; "Add email OTP as alternative when login reCAPTCHA failed" (EE 1.73.0, 2024-06-05); "Add rate limit and Recaptcha to on publishing notes". Blog, 2024-06-12: "if you're ever blocked by reCAPTCHA, you can receive a one-time password via email."
- Empty note: in-app strings "Pull from GitHub", "Push to GitHub", "Pull a file from GitHub" (features page source); "you could create a new empty note and see the last three templates you used at the bottom of the editing area" (template help). The exact "Link to GitHub" and "Or start with a template" wording was not found in page source: UNVERIFIED.

## 6. Markdown extensions (https://hackmd.io/s/features)

Containers `:::success`, `:::info`, `:::warning`, `:::danger`, `:::spoiler`, `:::spoiler {state="open"}`; GitHub alerts `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` ("Introduce GitHub Alerts markdown syntax", release dated 2024-05-02); emoji shortcodes (`:smile:`); MathJax inline `$` and block `$$`; fenced `sequence`, `flow`, `graphviz`, `mermaid`, `abc`, `plantuml`, `vega` (Vega-Lite), `fretboard`, `csvpreview`; code fences with `=` line numbers, `=101`, `=+`, and `!` wrapping; blockquote tags `[name=] [time=] [color=]`; externals `{%youtube %}`, `{%vimeo %}`, `{%gist %}`, `{%slideshare %}`, `{%speakerdeck %}`, `{%pdf %}`, `{%figma %}`; `[TOC]`; YAML metadata; `^sup^`, `~sub~`, `++ins++`, `==mark==`, `{ruby base|rubytext}`; task lists; typographer replacements. Four-colon `::::` nesting and raw `<style>` blocks are not documented on that note; the template help only acknowledges "HTML `<style>`" inside templates.

## Not opened / unverified

- Similarweb (202, empty), DuckDuckGo (202), Bing (200 but no result markup), https://hackmd.io/join and /login bodies (WAF challenge), https://hackmd.io/@docs/feature-preview (403), changelog pages beyond the first (client-side pagination).
- Wikipedia: no article exists under the three titles.
- Web search hits seen but not opened: [Capterra](https://www.capterra.com/p/246874/HackMD/), [SaaSworthy](https://www.saasworthy.com/product/hackmd-io), [Markdown Guide](https://www.markdownguide.org/tools/hackmd/), [CB Insights HackMD vs Scribe](https://www.cbinsights.com/compare/hackmd-vs-scribe-2), [hackmd.io](https://hackmd.io/), [tutorials](https://hackmd.io/c/tutorials).
- UNVERIFIED: the "Scribe" feature; the exact empty-note wording; whether note editing itself now runs on Yjs (only a folder-sync mention exists).

## What this means for a competitor

1. HackMD is eleven years old, funded, SOC 2 Type II, and shipping about four releases a month in 2026; it is not a stale incumbent.
2. Its 2026 story is "agents plus humans on Markdown": MCP server, skills, `Accept: text/markdown`, Versions API, all landed between January and September 2026.
3. Its MCP `update-note` is documented as "Overwrite the content of an existing note"; byte-exact splice writing is not something it advertises.
4. Nothing opened claims a review-state or span-attribution feature; version history is whole-note, and suggest-edit is a beta permission.
5. Self-hosting, GitLab, SSO and custom domains are Enterprise-only; the free tier caps GitHub pushes at 20 a month and history at 10 versions.
6. Personal Prime is $6 monthly or $48 a year; team Prime is $5 to $8 a seat, so a sub-$5 team price undercuts it.
7. Sign-up sits behind an AWS WAF challenge plus reCAPTCHA Enterprise, with an email OTP fallback; frictionless first-run is an opening.
8. It has no iOS app found, its VS Code extension was last updated in March 2023, and its desktop repo last moved in January 2023.
9. Its syntax surface is wide (containers, alerts, nine diagram fences, externals), so a byte-exact editor must decide which of these to render or refuse.
10. Audience overlap is developer communities and crypto foundations; the logos and investors say where its distribution comes from.