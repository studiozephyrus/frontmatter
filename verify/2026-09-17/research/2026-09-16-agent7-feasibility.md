All seven checked against live pages. Here is the report.

---

## 1. Serving markdown to agents

**The convention exists and is named.** `https://llmstxt.org/` returned 200 and reads: "A proposal to standardise on using an /llms.txt file to provide information to help agents use a website." Author: **Jeremy Howard**. "Published September 3, 2024 / Modified August 10, 2026." It is now v2: "This is v2 of the proposal, updated based on what I learned from two years of adoption: thousands of sites publish an llms.txt file, documentation platforms generate one automatically, and Chrome's Lighthouse audits sites for one as part of its agentic browsing checks."

The second half of the proposal is the one that matters here: "We furthermore propose that pages with information that agents might need provide a clean markdown version of those pages at the same URL as the original page, either with `.md` appended (`page.html.md`) or with the extension replaced by `.md` (`page.md`)." It also specifies discovery headers: `Link: </docs/page.html.md>; rel="alternate"; type="text/markdown", </docs/llms.txt>; rel="describedby"`.

**`/llms.txt` HTTP status:** `docs.anthropic.com` **301** → `https://platform.claude.com/docs/llms.txt`, 200 on follow; `docs.cloudflare.com` **301** → `developers.cloudflare.com/llms.txt`, 200 on follow; `developers.cloudflare.com` **200**; `docs.stripe.com` **200**; `vercel.com` **200**. First bytes, respectively: "`# Cloudflare Developer Documentation`", "`# Stripe Documentation`", "`# Vercel`", "`# Anthropic Developer Documentation`".

**Content negotiation works on all four tested, single-hop, no redirect.** `curl -sI -H "Accept: text/markdown"` returns `content-type: text/markdown; charset=utf-8` for `docs.stripe.com/payments` (`vary: Accept, Accept-Language`), `developers.cloudflare.com/workers/` (`vary: accept-encoding, accept`) and `vercel.com/docs` (`vary: Accept`) — each of which returns `text/html` with no Accept header. Anthropic's serves markdown plus `link: </docs/llms.txt>; rel="llms-txt", </docs/llms-full.txt>; rel="llms-full-txt", </docs/.well-known/api-catalog>; rel="api-catalog", </docs/.well-known/mcp/server-card.json>; rel="mcp-server-card"` and more.

**`.md` suffix: 200 + `text/markdown` on all four.** `docs.anthropic.com/en/docs/claude-code/overview.md` → "`> ## Documentation Index\n> Fetch the complete documentation index at: https://code.claude.com/docs/l`". `developers.cloudflare.com/workers/index.md` → "`---\ndescription: Build and deploy serverless applications across Cloudflare's global network with Wo`". `docs.stripe.com/payments.md` → "`# Payments\n\nUse Stripe to start accepting payments.\n\n## Get started\n\nIntegrate with Stripe to start `". `vercel.com/docs/functions.md` → "`---\ntitle: Vercel Functions\nproduct: vercel\nurl: /docs/functions\ncanonical_url: "https://vercel.com/`".

**FEASIBLE** — zero marginal cost; a static `/llms.txt` plus `.md` twins or a `Vary: Accept` route, both already industry-standard.

## 2. Opening a GitHub markdown file from a browser with no token

`raw.githubusercontent.com/github/spec-kit/main/README.md` → `HTTP/2 200`, `access-control-allow-origin: *`, `content-type: text/plain; charset=utf-8`.

`api.github.com/repos/github/spec-kit/contents/README.md` with `Origin: https://example.com` → `HTTP/2 200`, `access-control-allow-origin: *`, plus `access-control-expose-headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, …`.

`api.github.com/rate_limit` unauthenticated core: `{"limit": 60, "remaining": 54, "reset": 1789514482, "used": 6}`. Response headers agreed: `x-ratelimit-limit: 60`, `x-ratelimit-resource: core`.

**FEASIBLE** — free, but **60 requests per hour per IP** on the API; `raw.githubusercontent.com` is the un-throttled path for fetching file bytes and is also `*`-CORS, so prefer raw and use the API only for listing.

## 3. Linux desktop distribution for Tauri

`https://v2.tauri.app/distribute/` (200) states: "For Linux you can distribute your app using the Debian package, Snap, AppImage, Flatpak, RPM or Arch User Repository (AUR) formats." All six sub-pages returned 200.

**Certificate:** none required. The overview says "Signing is required on most platforms" and links a Linux page; `https://v2.tauri.app/distribute/sign/linux/` (200) is GPG-only — "You can embed a signature in the AppImage by setting the following environment variables: `SIGN` … `SIGN_KEY` … `APPIMAGETOOL_SIGN_PASSPHRASE`" — and carries a caution: "**The signature is not verified** AppImage does not validate the signature, so you can't rely on it to check whether the file has been tampered with or not." No CA, no paid certificate, unlike macOS/Windows.

**Cross-compiling: your belief is correct.** The v2 docs have no dedicated cross-compilation page (checked `sitemap-0.xml`); the v1 page that remains live, `https://tauri.app/v1/guides/building/cross-platform/`, states: "Tauri relies heavily on native libraries and toolchains, so meaningful cross-compilation is **not possible** at the current moment. The next best option is to compile utilizing a CI/CD pipeline hosted on something like GitHub Actions." The v2 GitHub Actions page corroborates by matrix — separate `ubuntu-22.04`, `ubuntu-22.04-arm`, `macos-latest`, `windows-latest` runners — and the AppImage page adds: "linuxdeploy, the AppImage tooling Tauri uses, currently does not support cross-compiling ARM AppImages. This means ARM AppImages can only be built on ARM devices or emulators."

**FEASIBLE** — no certificate cost, but it requires a Linux CI runner; macOS cannot build the Linux artefacts. (The "not possible" quote is from v1 docs, flagged as old version; v2 has no contradicting statement.)

## 4. Python scoring script as a Vercel route

`https://vercel.com/docs/functions/runtimes/python` (via `.md`, `last_updated: 2026-08-12`): "Use the Python runtime to run ASGI … and WSGI … applications on Vercel." Entrypoint must be `app.py`, `index.py`, `server.py`, `main.py`, `wsgi.py`, or `asgi.py` (or `src/`/`app/`, or `tool.vercel.entrypoint`) defining a top-level `app` or `application`.

Versions, verbatim: "**3.12** (default)", "**3.13**", "**3.14**".

Limits from `https://vercel.com/docs/functions/limitations` (`last_updated: 2026-08-24`): "Size (uncompressed) — 250 MB, or 500 MB for Python. Large functions support up to 5 GB Beta." "Maximum duration — Hobby: 300s default and maximum. Pro and Enterprise: 300s default, 800s maximum, and 1800s extended maximum Beta." "Maximum memory — Hobby: 2 GB, Pro and Ent: 4 GB."

**FEASIBLE** — no extra platform cost; the script must be reshaped as an ASGI/WSGI app under 500 MB and 300 s.

## 5. Student plans

`https://education.github.com/pack` (200) does not state the rules; `https://docs.github.com/en/education/about-github-education/github-education-for-students/apply-to-github-education-as-a-student` (200) does. Qualification: "Are enrolled in a degree- or diploma-granting program, such as a high school, college, university, or homeschool. Provide documents that prove your current student status… Own a GitHub personal account. Are at least 13 years old." Accepted proof: "A picture of your school ID with current enrollment date / Your class schedule / Your transcript / An affiliation or enrollment verification letter." Also: "GitHub's verification process is individually tailored. When the system detects that recent applicants from your school successfully verified using their academic email, future applicants from the same school must also use an academic [email]."

Third-party tools can join, but the gate is narrow. `https://education.github.com/partners` (200): "Student Developer Pack partners are an essential part of our student's learning experience. **We seek out and onboard 5-10 new partners per year.** Partner tools and resources must align with the developer lifecycle or related fields and **be offered at no cost to the student**. Please fill out our partnership application to have your company considered. Please note that not all who inquire are approved to join the Student Developer Pack." The application link on that page is `https://survey3.medallia.com/?IqFRAo-edu-partnership`.

Kiro, `https://kiro.dev/blog/students-2026/` (200), dated **September 8, 2026**, by Sharanya Balaji: "When we launched the Kiro Students tier in March, we started with 11 universities… So we are expanding the Kiro Students program to **121 new universities** across 16 countries. Eligible students in those 16 countries now get the same offer: **one full year of free access to Kiro with 1,000 credits per month, with full access to paid features such as premium models and Kiro Web**. No credit card. No trial timer." Verification: "complete a quick verification through SheerID."

**FEASIBLE but slow** — pack entry costs nothing in fees but competes for 5–10 slots a year and requires the tool be free to students; a SheerID-style self-run student tier (Kiro's route) needs no GitHub approval at all.

## 6. Google Docs to markdown

`https://support.google.com/docs/answer/12014036` (200), verbatim: "**Export a Google Doc as Markdown** — You can export the document as Markdown for use in another application. You'll download a Markdown file (.md). On your computer, open a document in Google Docs. Click File → Download. Select Markdown (.md)." And: "**Import Markdown as a Google Doc** — When in Google Docs: Click File → Open → Upload. Select your Markdown file, this is uploaded and opens up automatically." Also "Copy Google Docs content as Markdown" and "Paste from Markdown", both right-click actions, and a Tools → Preferences "Enable Markdown" checkbox.

Drive API, `https://developers.google.com/workspace/drive/api/guides/ref-export-formats` (200): the **Documents** table row reads `Markdown | text/markdown | .md`. `https://developers.google.com/workspace/drive/api/guides/manage-downloads` (200): "To export Google Workspace document byte content, use the `files.export` method with the ID of the file to export and the correct MIME type. **Exported content is limited to 10 MB.**"

**FEASIBLE** — free; `files.export` with `text/markdown`, capped at 10 MB per document, plus OAuth scope.

## 7. Reverse-engineering docs from a repo

GitHub Copilot already covers this as documented, first-party workflow. `https://docs.github.com/en/copilot` (200) lists a **Document code** section with "Document legacy code", "Explain legacy code", "Explain complex logic", "Sync documentation", "Write discussions or blog posts", plus prompt-file recipes "Create README" and "Document API". The sync-documentation tutorial (`/en/copilot/tutorials/copilot-cookbook/document-code/sync-documentation`, 200) states: "It can be difficult to keep documentation up to date with changes to code. However, good documentation is essential for maintaining codebases… Copilot Chat can assist in updating existing code documentation." So the capability ships inside a subscription most target users already hold.

Mintlify sells the paid version of it. `https://mintlify.com/pricing` (200): **Starter $0/mo** ("For individuals and small teams", 5 editor seats), **Pro $450/mo** ("Unlimited editor seats", adds "Agent", "Assistant", "Automations"), **Enterprise "Contact us"**. Agent credits: "10,000 / month" on Pro, "$0.01 per credit for overages", "250 credits / update", "25 credits / answer". `https://mintlify.com/docs/agent` (200) confirms repo-sourced generation: "The agent is an AI tool that creates pull requests with proposed changes to your documentation based on your prompts… **Researches**: Searches and reads your existing documentation, any connected repositories, relevant context, and the web", and "Reference source code from any repository that has the Mintlify GitHub App installed." It is gated: "The agent requires a Pro or Enterprise plan."

**FEASIBLE but crowded** — the incumbent price is $450/mo (Mintlify Pro) and the commodity version is already bundled into Copilot at no extra cost.

---

## Not opened

- `https://v2.tauri.app/distribute/sign/linux/` opened (200), but **no v2 page states the macOS→Linux cross-compile position**; the quote used is from the v1 docs, which the page itself labels "This documentation covers Tauri 1 (old version)". Treat the v2 position as inferred from the build matrix, not stated.
- `https://kiro.dev/blog/rss.xml` → 404. Blog listing and the post itself opened instead.
- `https://mintlify.com/agent` → 404 (used `/docs/agent`, 200).
- GitHub Copilot: I did not open a page claiming end-to-end "generate a full docs site from a repo" — the documented scope is per-file/per-function documentation, README and API prompt files, not site generation.