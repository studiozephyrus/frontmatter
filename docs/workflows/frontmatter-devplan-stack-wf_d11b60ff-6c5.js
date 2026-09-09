// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-devplan-stack',
  description: 'The complete end-to-end engineering plan: every layer specified, costed, and sequenced',
  phases: [
    { title: 'Core', detail: 'frontend, API, data, auth, live editing' },
    { title: 'Platform', detail: 'hosting, CI/CD, security, caching, scaling, observability, DR' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const PRD = FM + 'docs/FRONTMATTER-PRD-v2-2026-08-29.md'

const HOUSE = [
  '',
  'YOU ARE WRITING A FINISHED SECTION OF AN ENGINEERING PLAN that a solo founder will build from, using Claude as the implementer. It must be concrete enough that an AI agent can start work from it without asking questions.',
  '',
  'STYLE:',
  '- Open with the exact H2 heading given. Use H3 subsections.',
  '- Table-first. Real code, real config, real file paths, real package names with versions.',
  '- NO preamble, NO conclusion, NO commentary about your process.',
  '- Evidence tags: [fetched] primary source opened, [measured] executed here, [SS] search summary, [derived] arithmetic shown, [inference] reasoning.',
  '- Every choice states: what we pick, the alternative rejected, WHY, the cost, and what would make us change our mind.',
  '- Prices and limits MUST carry the date you read them.',
  '- Include at least one mermaid diagram where a topology or flow needs one. Under 12 nodes.',
  '',
  'THE PRODUCT: a markdown editor. Simple surface, deep engine. THE FILE IS THE ONLY SOURCE OF TRUTH; every view is a deterministic reversible projection owning no state. Engine does byte-preserving splice edits (locate range, replace those bytes, REFUSE rather than guess) plus cross-engine degradation certification. Positioned as Google Docs for markdown with deep AI, serving both D2C and self-serve B2B teams.',
  '',
  'SETTLED ARCHITECTURE, build on it, do not re-litigate:',
  '- Documents live in the user git repo. That is the source of truth. Never move it.',
  '- Sync = git three-way merge + an append-only splice journal + compare-and-swap. NEVER a CRDT for the document bytes.',
  '- One Postgres as CONTROL PLANE ONLY, holding zero document bytes: identity, tenancy, entitlements, billing, publish-slug uniqueness, audit, jobs.',
  '- Cloudflare R2 for attachments over 1MB and derived artifacts. Egress is free there; that is load-bearing.',
  '- workspace_id on every row with pooled RLS from day one. The GitHub App installation is the CONNECTOR, never the tenant identity.',
  '- Search: stop shipping whole-vault snapshots; Postgres full-text plus trigram server-side; MiniSearch client-side only.',
  '- No arbitrary client-side code execution, ever. That lane is refused.',
  '- Current repo: Next 16.2.6, React 19.2.6, CodeMirror 6, unified/remark/rehype, next-auth v5, AI SDK v6 with five providers, Tauri v2, 226 TS files, 25,407 lines, 98 test files, 1,575 tests, NO CI at all.',
  '',
  'CONSTRAINTS THAT SHAPE EVERY ANSWER: one founder. India-based, selling globally. Cost matters at small scale — the model must be near-zero at 100 users and predictable at 10,000. Prefer boring, managed, and swappable over clever. Every component must be operable by one person on call.',
  '',
  'Use curl to check current pricing, limits and versions — WebFetch is gate-refused here but curl is not. Test curl before concluding a source is unreachable.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: full section text as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL TEXT.',
  'Target 2000-3200 words. Your entire final message IS the section text.',
].join('\n')

phase('Core')

const CORE = [
  ['d1-frontend',
   'Write "## 3. Frontend architecture".\n\nCover: the rendering strategy (React Server Components vs client, and which routes are which, given a document editor is intensely client-side); state management and why (zustand is already in the repo); the CodeMirror 6 integration boundary and how editor state relates to app state; routing; code splitting and the bundle budget with a real byte ceiling; the offline/PWA story and service-worker strategy (the corpus has ZERO service-worker research, so this is new ground); optimistic UI for a splice-based writer; the component architecture for the four editor modes plus render profiles; and the desktop shell via Tauri v2 and what it shares with web.\n\nGive a concrete file/folder architecture that extends the existing src/modules layout. State the bundle budget in kilobytes and how it is enforced in CI.'],

  ['d2-api',
   'Write "## 4. API design and contracts".\n\nCover: REST vs RPC vs GraphQL for this product and why; the complete v1 endpoint list with method, path, auth, idempotency and rate class; the resource model given the unit is a FILE in a git repo; versioning and deprecation policy; pagination and cursors; idempotency keys on writes (a retried commit on flaky mobile must not duplicate a note); error format (RFC 9457 problem details); webhooks vs polling; how the public API relates to the MCP server — one surface or two; and OpenAPI generation.\n\nInclude the exact request/response shape for the three hardest endpoints: commit-with-base-sha, land(), and publish/unpublish with immediate revocation.'],

  ['d3-database',
   'Write "## 5. Data layer — schema, migrations, and the control plane".\n\nCover: the complete Postgres schema as real DDL for the control plane (workspaces, users, memberships, vault connections, publish slugs, entitlements, billing mirror, API keys, jobs, audit log, AI usage meter) with workspace_id and RLS policies; index strategy with the leading composite on workspace_id; the migration tool choice and why; connection pooling for serverless (this is a real trap — name the pooler); Neon vs Supabase vs plain RDS with current prices; read replicas and when; and the boundary rule that NO document bytes enter Postgres.\n\nAlso: the derived-data stores — search index, render cache, certificate sidecars — where each lives and how each is rebuilt from scratch.'],

  ['d4-auth-permissions',
   'Write "## 6. Authentication, authorisation and permissions".\n\nCover: the auth stack (next-auth v5 is present; Firebase is present and must be deleted — two auth paths is two session-fixation surfaces for one operator); the GitHub App flow end to end with the exact fine-grained permissions requested and why NOT the OAuth repo scope; token storage and refresh; session strategy for a PWA plus a Tauri desktop shell; BYO-API-key custody with envelope encryption and the rule that the key store is separate from the document store; the permission model layered over git-provider permissions (defer, duplicate, or intersect - decide it); RLS enforcement in Postgres; and API key auth for third-party access.\n\nInclude the exact GitHub App permission set, and a sequence diagram of the install-to-first-commit flow.'],

  ['d5-live-editing',
   'Write "## 7. Live editing, presence and collaboration".\n\nThis is the largest unresearched area in the plan. The product is positioned as Google Docs for markdown, which implies live editing, but the settled architecture REFUSES a CRDT for document bytes because byte-identity is unassertable across a CRDT merge.\n\nResolve that tension concretely. Cover: what live editing actually means for this product and which parts users demand versus assume; the ephemeral-session design where a CRDT or OT layer may exist ONLY as a scratch buffer whose single output is one splice at session end, never a store of record; presence and cursors (cheap, and separable from co-editing); awareness protocol; the transport (WebSocket vs SSE vs Durable Objects) with current Cloudflare limits and prices; conflict surfacing when live editing is off; and the honest answer on whether v1 needs any of it.\n\nResearch with curl: Yjs, Loro, Automerge current versions and bundle sizes; Cloudflare Durable Objects and Workers WebSocket limits and pricing; Liveblocks, PartyKit, Ably and Pusher pricing; and how Notion, HackMD and Obsidian actually handle multi-user editing. Give a build-vs-buy verdict with numbers.'],
]

const core = await parallel(CORE.map((x) => () => agent(x[1] + HOUSE, { label: x[0], phase: 'Core' })))

phase('Platform')

const PLATFORM = [
  ['d6-hosting-deployment',
   'Write "## 8. Hosting, deployment and environments".\n\nCover: the hosting topology (Vercel for the Next app; Cloudflare Workers and R2; where the Postgres lives; where background jobs run) with a mermaid topology diagram; why NOT a single VPS and why NOT full Kubernetes for one founder; regions and the data-residency consequence; environments (local, preview, staging, production) and how preview environments get data; the 4.5MB serverless response cap that already bites this product; cold starts; the PDF/chromium path which cannot live in a normal serverless function; custom domains for published pages including wildcard TLS; and rollback.\n\nGive current prices with dates for every component, and a monthly bill at 100, 1,000 and 10,000 users.'],

  ['d7-cicd',
   'Write "## 9. CI/CD, version control and release".\n\nThe repo currently has NO .github directory at all. Cover: the complete GitHub Actions pipeline as real YAML (typecheck, lint, test, build, arch report with its minimum-files-scanned floor, spec gate, corpus oracle, bundle budget); branch strategy and protection rules; preview deploys per PR; the release process and versioning; database migration safety in CI including expand-migrate-contract; secret management in CI; caching to keep runs fast and cheap; the required-checks list; and the rule that CI must be made to FAIL once on a deliberately broken commit before any green is trusted.\n\nAlso: how an AI agent working on this repo interacts with CI, and the reconciliation rule that captures git rev-parse HEAD before and after every agent run.'],

  ['d8-security',
   'Write "## 10. Security, rate limiting and abuse prevention".\n\nCover: the threat model for a product holding user documents and API keys; secrets management; HTTP security headers and CSP for an app that renders user markdown; XSS through rendered markdown and the sanitisation boundary; SSRF via user-supplied URLs; rate limiting design (algorithm, per-tier limits, where enforced, what the 429 says) tied to the cost model; bot and scraper defence on published pages; the GitHub App token blast radius; prompt injection when an agent reads untrusted documents and the lethal-trifecta gate; dependency and supply-chain security; and the vulnerability disclosure path.\n\nGive the rate-limit table by tier with the arithmetic connecting it to unit economics, and the exact CSP header.'],

  ['d9-caching-cdn',
   'Write "## 11. Caching and content delivery".\n\nCover: the cache hierarchy (browser, CDN, edge, application, database) and what belongs in each; cache keys and invalidation for a product where the source of truth is a git repo that changes outside our control; sha-keyed caching of file content; published-page caching and the hard requirement that unpublish revokes IMMEDIATELY including CDN purge; the snapshot problem (77.5MB parsed per cold start today, and the response is 16.4x the platform body cap) and how caching fixes or fails to fix it; stale-while-revalidate; the GitHub API rate-limit budget (a GitHub App installation caps at 12,500 requests/hour) and how caching protects it; and CDN choice with prices.\n\nInclude a cache-decision table: DATA | LAYER | TTL | KEY | INVALIDATED BY.'],

  ['d10-scaling',
   'Write "## 12. Scaling, load balancing and capacity".\n\nCover: the capacity model at 100 / 1,000 / 10,000 / 100,000 users with the arithmetic; which component breaks first at each step and the measured or derived evidence; horizontal scaling for stateless functions and why load balancing is mostly a managed concern here rather than something we build; database connection limits as the real bottleneck in serverless; queue design for background jobs (certificate generation, imports, publish builds) and the backpressure rule; the GitHub API as an external rate limit we do not control; graceful degradation ladder — what we shed first under load; and the honest statement of where this architecture stops working and what replaces it.\n\nName the first three things that will break, in order, with the number at which each breaks.'],

  ['d11-observability-dr',
   'Write "## 13. Observability, availability and disaster recovery".\n\nCover: error tracking, structured logging with workspace_id and correlation_id from day one, metrics, and tracing — with tool choices and current prices; the ABSOLUTE constraint that logs must never capture document content, and the specific mechanisms (beforeSend scrubbing, breadcrumb filtering, source-map handling) plus the retention limits DPDP and GDPR imply; SLOs a solo founder can honestly commit to and what to publish; alerting rules worth a 3am wake-up versus what must not page; the status page; incident runbook skeleton; backup and restore with RPO/RTO per data class, noting that Cloudflare R2 has NO object versioning so versioning must be built into the key layout; the restore drill schedule; and the rule that a backup never restored is not a backup.\n\nInclude the alert table: SIGNAL | THRESHOLD | PAGES? | RUNBOOK.'],
]

const platform = await parallel(PLATFORM.map((x) => () => agent(x[1] + HOUSE, { label: x[0], phase: 'Platform' })))

return {
  core: CORE.map((x, i) => ({ label: x[0], text: core[i] })),
  platform: PLATFORM.map((x, i) => ({ label: x[0], text: platform[i] })),
}
