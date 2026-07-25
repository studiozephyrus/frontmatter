# sgnk-react — Complete Workflow Map

A visual, step-by-step map of how `sgnk-react` operates from the moment a user
types a trigger through to a deployed, production-grade React app. Every
arrow is real — it corresponds to a script call, a reference file, or a
gate. Read this end-to-end to understand the whole engine in one sitting.

> Skill location: `~/.claude/skills/sgnk-react/`
> Trigger: `/sgnk-react`, `sgnk.ai for react`, "restructure my react app", etc.
> Companion: `sgnk-next` (Next.js variant). Composes with `gvc`.

---

## 0. TL;DR — The one diagram

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                              USER TRIGGER                                       │
│        /sgnk-react    |    "restructure my react app"    |    "create X"        │
└──────────────────────────────────┬─────────────────────────────────────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │  Detect intent   │  ── CREATE vs TRANSFORM ──┐
                         └──────────────────┘                            │
                                   │                                     │
            ┌──────────────────────┴─────────────────────┐                │
            ▼                                            ▼                │
   ┌────────────────┐                          ┌────────────────────┐    │
   │   CREATE       │                          │    TRANSFORM       │    │
   │ (greenfield)   │                          │ (existing repo)    │    │
   └───────┬────────┘                          └────────┬───────────┘    │
           │                                            │                │
           ▼                                            ▼                │
   ┌────────────────┐                          ┌──────────────────────┐  │
   │ create-vite +  │                          │    STAGE 0           │  │
   │ scaffold.mjs   │                          │    ANALYZE           │  │
   │ + apply assets │                          │    (analyze.mjs +    │  │
   │ + write spine  │                          │     3 gates)         │  │
   └───────┬────────┘                          └────────┬─────────────┘  │
           │                                            │                │
           │                                            ▼                │
           │                                  ┌────────────────────┐    │
           │                                  │ Report + agree     │    │
           │                                  │ entry phase        │    │
           │                                  └────────┬───────────┘    │
           │                                           │                │
           └─────────────┐                  ┌──────────┴──────┐         │
                         │                  │                 │         │
                         ▼                  ▼                 ▼         │
                  ┌─────────────────────────────────────────────────┐   │
                  │              STAGE 1 — RESTRUCTURE              │◄──┘
                  │   Phase 1: kill god-folders (wrappers + moves)  │
                  │   Phase 2: composition root + ESLint at error   │
                  │   GATE: godfolder-blocklist + import-boundary   │
                  │         + clean-architecture-report = 0         │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │              STAGE 2 — SCALE                    │
                  │   S1 data fetching · S2 module barrels          │
                  │   S3 stricter TS  · S4 resilience               │
                  │   S5 CI enforcement · S6 observability          │
                  │   S7 security · S8 SEO/PWA · S9 E2E · S10 ADR   │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │           STAGE 3 — COMMERCIALIZE               │
                  │   Tenant context + scoped query keys            │
                  │   Workspace/seat/invite UI · Billing port       │
                  │   Entitlements · Flags · Onboarding · GDPR      │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │         STAGE 4 — PRODUCTION-HARDEN             │
                  │   Auth storage · CSP · XSS · Zod · errors       │
                  │   Telemetry · Web vitals budget · a11y          │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │              STAGE 5 — DEPLOY                   │
                  │   Vercel / CF Pages / Netlify / S3 / nginx      │
                  │   SPA fallback · asset hashing · CI pipeline    │
                  │   Preview / prod / rollback · monitoring        │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                                ╔═══════════════════╗
                                ║  ✅ LIVE & GREEN  ║
                                ╚═══════════════════╝
```

---

## 1. The skill on disk — what each file does

```
~/.claude/skills/sgnk-react/
│
├── SKILL.md            ◄── Machine entry. Loaded when trigger fires.
│                            Sets lifecycle, prime directive, gates, rules.
│
├── WORKFLOW.md         ◄── Human overview (short, structural).
├── WORKFLOW-MAP.md     ◄── THIS FILE (full visual map).
│
├── references/         ◄── Depth — loaded on demand, by stage.
│   ├── analysis-playbook.md        ─► STAGE 0
│   ├── architecture-rules.md       ─► all stages (the laws)
│   ├── code-quality-standards.md   ─► all stages (the bar)
│   ├── target-structure.md         ─► STAGE 1 (where files go)
│   ├── code-patterns.md            ─► STAGE 1+ (how layers look)
│   ├── phase-1-no-godfolder-migration.md  ─► STAGE 1·Ph1
│   ├── phase-2-conclusive-pass.md         ─► STAGE 1·Ph2
│   ├── phase-3-scalability-roadmap.md     ─► STAGE 2
│   ├── saas-commercialization.md          ─► STAGE 3
│   ├── production-readiness.md            ─► STAGE 4
│   ├── deployment-readiness.md            ─► STAGE 5
│   ├── project-starter.md          ─► CREATE mode + feature-build loop
│   └── portability.md              ─► wiring across agents
│
├── scripts/            ◄── Zero-dep enforcement. Run from CLI or CI.
│   ├── analyze.mjs                       ── one-shot scorecard
│   ├── scaffold.mjs                      ── greenfield skeleton
│   ├── godfolder-blocklist.mjs           ── GATE
│   ├── import-boundary-report.mjs        ── GATE
│   ├── clean-architecture-report.mjs     ── GATE (conclusive)
│   ├── route-inventory.mjs               ── parity tool
│   └── eslint-boundaries.config.mjs      ── layer rules
│
└── assets/             ◄── Turnkey copy-in config.
    ├── ci.yml                ── GitHub Actions (quality / arch / e2e)
    ├── package-scripts.json  ── verify / arch / analyze / budget
    ├── tsconfig.strict.json  ── full strict flag set
    └── adr-template.md       ── decision-record template
```

---

## 2. The two entry modes

### 2A. CREATE — greenfield

```
USER: "create dashx with auth, dashboard, billing"
                  │
                  ▼
    ┌───────────────────────────────┐
    │ 1. npm create vite@latest dashx  │
    │    --template react-ts        │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │ 2. node scaffold.mjs          │
    │    → creates src/ tree        │
    │    → per-layer READMEs        │
    │    → copies gates to          │
    │      specs/harness/           │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │ 3. Apply assets/              │
    │    • ci.yml → .github/        │
    │    • tsconfig.strict.json     │
    │    • package-scripts.json     │
    │    • adr-template.md          │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │ 4. Install deps               │
    │    react-router-dom           │
    │    @tanstack/react-query      │
    │    zod                        │
    │    + dev: eslint plugins,     │
    │      vitest, RTL, MSW,        │
    │      playwright, size-limit   │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │ 5. Write the spine            │
    │    • src/config/env.ts        │
    │    • src/shared/infra/http/   │
    │      api-client.ts (the one   │
    │      fetch site)              │
    │    • src/container/           │
    │      dependency-container.ts  │
    │    • src/app/main+root+router │
    │    • providers (Query/Theme/  │
    │      Auth/ErrorBoundary)      │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │ 6. First commit must be       │
    │    GREEN                      │
    │    npm run verify             │
    └───────────────┬───────────────┘
                    ▼
              [ FEATURE LOOP ]
              (Section 6 below)
```

### 2B. TRANSFORM — existing repo

```
USER: "restructure my react app" / "audit my CRA codebase"
                  │
                  ▼
    ┌───────────────────────────────┐
    │  Run analyze.mjs              │
    │  Run 3 gates                  │
    │  Capture baselines            │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │  Read package.json            │
    │  Detect React/Router/Query    │
    │  versions                     │
    └───────────────┬───────────────┘
                    ▼
    ┌───────────────────────────────┐
    │  Present REPORT:              │
    │  • "Already strong"           │
    │  • "Gaps (the work)"          │
    │  • Recommended entry phase    │
    │                               │
    │  WAIT FOR USER AGREEMENT      │
    │  before any file move         │
    └───────────────┬───────────────┘
                    ▼
              [ STAGE ENTRY ]
              (Section 3 below)
```

---

## 3. The lifecycle in detail

```
              ┌───────────┐
              │ ANALYZE   │  Stage 0
              └─────┬─────┘
                    │  recommendedEntryPhase
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
   ┌────────┐  ┌────────┐  ┌───────────┐
   │Phase 1 │  │Phase 2 │  │ Skip to   │
   │god-fold│  │concl-  │  │ Stage 2   │
   │er kill │  │usive   │  │ (clean    │
   │        │  │pass    │  │ already)  │
   └───┬────┘  └───┬────┘  └─────┬─────┘
       │           │             │
       └─────┬─────┘             │
             ▼                   │
       ┌─────────────┐           │
       │ SCALE       │◄──────────┘
       │ (S1–S10)    │  Stage 2
       └─────┬───────┘
             ▼
       ┌─────────────┐
       │COMMERCIALIZE│  Stage 3
       └─────┬───────┘
             ▼
       ┌─────────────┐
       │PROD-HARDEN  │  Stage 4
       └─────┬───────┘
             ▼
       ┌─────────────┐
       │DEPLOY       │  Stage 5
       └─────┬───────┘
             ▼
        ✅ LIVE
```

### Stage 0 — ANALYZE

```
                     ┌─────────────────────────┐
                     │   node analyze.mjs      │
                     └────────────┬────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            ▼                     ▼                     ▼
   ┌─────────────────┐   ┌───────────────┐   ┌─────────────────┐
   │ Structure       │   │ Clean-arch    │   │ Code quality    │
   │ • god-folders   │   │ • legacy alias│   │ • strict TS     │
   │ • modules       │   │ • layer viol. │   │ • any/ts-ignore │
   │ • container     │   │ • env leaks   │   │ • god files     │
   │ • router/main   │   │ • fetch leaks │   │ • godFiles>500  │
   └────────┬────────┘   └───────┬───────┘   └────────┬────────┘
            │                    │                    │
            ▼                    ▼                    ▼
   ┌─────────────────┐   ┌───────────────┐   ┌─────────────────┐
   │ React/Router    │   │ Bundle health │   │ SaaS readiness  │
   │ • lazy routes   │   │ • size-limit  │   │ • multi-tenancy │
   │ • Suspense      │   │ • visualizer  │   │ • billing       │
   │ • ErrorBoundary │   │ • manualChunks│   │ • flags         │
   │ • useEffect+fetch│  │               │   │ • auth/notif    │
   │ • inline fetch  │   │               │   │ • GDPR          │
   └────────┬────────┘   └───────┬───────┘   └────────┬────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 ▼
                  ┌─────────────────────────────┐
                  │   JSON SCORECARD            │
                  │   + recommendedEntryPhase   │
                  │   + saasReadiness (n/9)     │
                  └────────────┬────────────────┘
                               ▼
                  ┌─────────────────────────────┐
                  │ Gates (exit 0/1):           │
                  │ • godfolder-blocklist       │
                  │ • import-boundary-report    │
                  │ • clean-architecture-report │
                  └────────────┬────────────────┘
                               ▼
                  ┌─────────────────────────────┐
                  │  Report to user             │
                  │  Wait for agreement         │
                  └─────────────────────────────┘
```

**Routing rule:**

| Finding                                 | Enter at         |
| --------------------------------------- | ---------------- |
| god-folders / legacy aliases exist      | Stage 1 · Phase 1|
| structure clean, but layer leaks remain | Stage 1 · Phase 2|
| clean-architecture-report = 0           | Stage 2          |
| greenfield                              | CREATE flow      |

### Stage 1 — RESTRUCTURE (Phase 1 + Phase 2)

```
┌─────────────────────────────────────────────────────────────────┐
│                       PHASE 1                                    │
│              No-God-Folder Migration                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/components ──┐                                              │
│  src/services  ──┤                                               │
│  src/api       ──┼──► move EACH file to its hexagonal home      │
│  src/utils     ──┤    via target-structure.md placement map     │
│  src/helpers   ──┤                                               │
│  src/hooks     ──┘                                               │
│                                                                  │
│  Per file:                                                       │
│    1. Create target at modules/<m>/<layer>/<file>                │
│    2. Replace old file with re-export wrapper                    │
│    3. Run gates → green → commit                                 │
│    4. Sweep importers (~20–40 file batch PR)                     │
│    5. Delete wrapper when no importer remains                    │
│    6. Run gates → green → commit                                 │
│                                                                  │
│  BATCH ORDER (lowest risk first):                                │
│    1. UI primitives  → shared/presentation/ui/                   │
│    2. Pure utils     → shared/presentation/lib/                  │
│    3. HTTP client    → shared/infrastructure/http/               │
│    4. Generic hooks  → shared/presentation/hooks/                │
│    5. Auth feature   → modules/auth/{layers}                     │
│    6. Each feature   → modules/<feature>/{layers}                │
│    7. App shell      → modules/app-shell/presentation/           │
│    8. Router         → src/app/routes/(group)/page.tsx + lazy()  │
│                                                                  │
│  EXIT: godfolder-blocklist EXIT 0                                │
│        import-boundary-report EXIT 0                             │
│        route-inventory diff EMPTY                                │
│        visual snapshots WITHIN THRESHOLD                         │
└────────────────────────────────┬─────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PHASE 2                                    │
│              Conclusive Clean Architecture Pass                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Batch 1: extract fetch() from components                        │
│    component fetch() ──► module/infra/<m>-http-repository.ts    │
│                          (via HttpClient port)                   │
│                                                                  │
│  Batch 2: extract orchestration into use-cases                   │
│    "if X then fetch+setState+track" in a hook                   │
│    ──► modules/<m>/application/use-cases/<verb>-<noun>.ts       │
│        with unit test (mocked ports)                             │
│                                                                  │
│  Batch 3: composition root per module                            │
│    Add `<module>Api = { useCase1, ... }` in                      │
│    container/dependency-container.ts                             │
│                                                                  │
│  Batch 4: env hygiene                                            │
│    import.meta.env only in src/config + */infrastructure         │
│                                                                  │
│  Batch 5: DTOs across boundaries                                 │
│    raw JSON spread as props ──► mapper → DTO → render            │
│                                                                  │
│  Batch 6: flip ESLint layer rules to ERROR                       │
│    boundariesConfig from scripts/eslint-boundaries.config.mjs    │
│                                                                  │
│  Batch 7: route-loader cleanup                                   │
│    loaders call use-cases via container, return DTO              │
│                                                                  │
│  Batch 8: provider scope audit                                   │
│    each provider injects exactly one concern                     │
│                                                                  │
│  EXIT: clean-architecture-report = 0 (total: 0)                  │
│        ESLint clean at error                                     │
│        every extracted use-case has a unit test                  │
└─────────────────────────────────────────────────────────────────┘
```

### Stage 2 — SCALE

```
┌─────────────────────────────────────────────────────────────────┐
│  20-year scalability roadmap — pick by priority, each tagged    │
│  [no-behavior-change] or [behavior/perf change].                │
├─────────────────────────────────────────────────────────────────┤
│  P1 │ S1 │ Data fetching     │ TanStack Query + key factory     │
│  P1 │ S2 │ Module barrels    │ index.ts + entry-point lint      │
│  P1 │ S3 │ Stricter TS       │ noUnchecked + exactOptional      │
│  P1 │ S4 │ Resilience        │ retry/backoff/Abort + offline    │
│  P1 │ S5 │ CI enforcement    │ harness + size-limit + LH-CI     │
│  P2 │ S6 │ Observability     │ Sentry/OTel + web-vitals + RUM   │
│  P2 │ S7 │ Security          │ CSP + SRI + Trusted Types        │
│  P2 │ S8 │ SEO / PWA         │ per-route meta + sitemap + mfst  │
│  P2 │ S9 │ E2E coverage      │ Playwright critical flows        │
│  P3 │ S10│ Rendering ADR     │ SPA / SSR / Astro decision       │
└─────────────────────────────────────────────────────────────────┘
```

### Stage 3 — COMMERCIALIZE

```
┌─────────────────────────────────────────────────────────────────┐
│  Multi-tenancy + commercial concerns as modules.                │
├─────────────────────────────────────────────────────────────────┤
│  Tenant context ──┬─► query keys include workspaceId            │
│                   ├─► cache cleared on workspace switch         │
│                   └─► every infra call carries tenant header    │
│                                                                  │
│  Workspace UI    ──► invite, seats, role-per-workspace          │
│  Billing port    ──► Stripe checkout + portal redirects         │
│                      (backend talks to Stripe, not the SPA)     │
│  Entitlements    ──► useEntitlement('feature') hook             │
│  Quotas          ──► useQuota('resource.count') hook            │
│  Feature flags   ──► FeatureFlags port (PostHog/LD/Statsig)     │
│  Onboarding      ──► server-computed next-step stepper          │
│  GDPR self-serve ──► export + delete request UI                 │
│  Notifications   ──► realtime inbox + preferences               │
│  Public API      ──► (optional) key console + OpenAPI docs      │
└─────────────────────────────────────────────────────────────────┘
```

### Stage 4 — PRODUCTION-HARDEN

```
┌─────────────────────────────────────────────────────────────────┐
│  Auth     │ httpOnly cookie preferred; in-memory bearer only    │
│  CSRF     │ SameSite + origin check + double-submit if x-origin │
│  Input    │ Zod at every boundary (forms, params, callbacks)    │
│  XSS      │ no raw HTML injection without sanitizer; no eval    │
│  URLs     │ validate redirect targets; allowlist external       │
│  CSP      │ host-level; nonce; no unsafe-inline in prod         │
│  Errors   │ route-level ErrorBoundary; typed domain errors      │
│  Telemetry│ Sentry/OTel + web-vitals + sourcemaps + replays     │
│  Resilient│ AbortController + retry/backoff + timeouts          │
│  Perf     │ lazy routes + suspense + skeletons + virtualization │
│  Images   │ lazy + AVIF/WebP + dimensions + srcSet              │
│  Budget   │ LCP<2.5s · INP<200ms · CLS<0.1 · main<180kB gz      │
│  a11y     │ jsx-a11y ERROR + keyboard + focus + contrast        │
│  SEO/meta │ per-route title/og via react-helmet-async           │
│  Deps     │ npm audit in CI · Renovate · lockfile · pin engines │
└─────────────────────────────────────────────────────────────────┘
```

### Stage 5 — DEPLOY

```
┌─────────────────────────────────────────────────────────────────┐
│  Target selection (pick ONE; don't mix mental models):          │
│    • Vercel (default for App-Router-style; vercel.ts)            │
│    • Cloudflare Pages (_headers + _redirects)                    │
│    • Netlify (_headers + _redirects + netlify.toml)              │
│    • S3 + CloudFront (manual CSP + SPA error rule)               │
│    • nginx self-host (try_files $uri /index.html)                │
│                                                                  │
│  Config:                                                          │
│    • SPA fallback rewrite: /* → /index.html (CRITICAL)           │
│    • /assets/*       → public, immutable, 1 year                 │
│    • /index.html     → public, max-age=0, must-revalidate        │
│    • CSP + HSTS + nosniff + Referrer-Policy headers              │
│                                                                  │
│  CI pipeline (assets/ci.yml):                                    │
│    Job quality      → typecheck · lint · test · build · budget   │
│    Job architecture → 3 gates (godfolder · imports · clean-arch) │
│    Job e2e          → Playwright critical flows                  │
│    (+ lighthouse-ci against preview deployment)                  │
│                                                                  │
│  Promotion:                                                       │
│    PR → preview URL → review → merge → prod                      │
│    Rolling Releases (canary) when available                      │
│    Rollback exercised pre-launch                                 │
│                                                                  │
│  Go-live checklist (production-readiness §13).                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. The target architecture (zoom-in)

```
        ┌────────────────────────────────────────────────────────┐
        │                    BROWSER (the SPA)                   │
        │                                                        │
        │   ┌────────────────────────────────────────────────┐  │
        │   │                   app/                          │ │
        │   │   main.tsx → root.tsx → router.tsx              │ │
        │   │   providers/ · routes/(public|workspace)/page   │ │
        │   └────────────────────┬────────────────────────────┘ │
        │                        │ imports only via             │
        │                        │  dependency-container.ts     │
        │                        ▼                              │
        │   ┌─────────────────────────────────────────────────┐ │
        │   │              presentation/                       │ │
        │   │   components · hooks · schemas · loaders         │ │
        │   │   (renders DTOs, calls hooks; never fetch())     │ │
        │   └────────────────────┬────────────────────────────┘ │
        │                        │                              │
        │                        ▼                              │
        │   ┌─────────────────────────────────────────────────┐ │
        │   │               application/                       │ │
        │   │   use-cases · ports · DTOs · query-keys          │ │
        │   │   cache-policy · authorization predicates        │ │
        │   └────────────────────┬────────────────────────────┘ │
        │                        │                              │
        │                        ▼                              │
        │   ┌─────────────────────────────────────────────────┐ │
        │   │                  domain/                         │ │
        │   │   entities · value objects · policies · errors   │ │
        │   │   port interfaces · branded ids   (PURE)         │ │
        │   └─────────────────────────────────────────────────┘ │
        │                                                       │
        │   ┌─────────────────────────────────────────────────┐ │
        │   │           infrastructure/                        │ │
        │   │   HTTP client (the ONE fetch site)               │ │
        │   │   *-http-repository.ts · websocket client        │ │
        │   │   token storage · telemetry · analytics          │ │
        │   │   feature-flag SDK · billing SDK · storage       │ │
        │   │   (implements application ports)                 │ │
        │   └────────────────────┬────────────────────────────┘ │
        │                        │                              │
        │                        ▼                              │
        │   ┌─────────────────────────────────────────────────┐ │
        │   │              container/                          │ │
        │   │   dependency-container.ts                        │ │
        │   │   (composes infra into use-cases — ONE wiring    │ │
        │   │    site that app/presentation may import)        │ │
        │   └─────────────────────────────────────────────────┘ │
        │                                                       │
        │   config/env.ts (the only reader of import.meta.env   │
        │                  outside infrastructure/)             │
        └────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼ HTTP (the ONE port)
                          ┌─────────────┐
                          │   BACKEND   │  ◄── Security boundary.
                          │   (truth)   │      Client gates are UX.
                          └─────────────┘
```

### Dependency arrow legend

```
app ────► presentation ────► application ────► domain
                                    ▲
                                    │
                            infrastructure  (implements application ports)
                                    ▲
                                    │
                              container  (wires infra → use-cases)
```

**Invariants enforced by `clean-architecture-report.mjs`:**
- `app`/`presentation`/`application` cannot import from any `infrastructure/`
  folder. Only `@/container/dependency-container` is allowed.
- `domain`/`application` cannot import `react`, router libs, query libs,
  HTTP clients, or SDKs.
- `domain`/`application`/`presentation` cannot reference `import.meta.env`.
- `domain`/`application` cannot construct HTTP primitives.
- Bare `fetch(` is forbidden outside `infrastructure/`.

---

## 5. A request, end-to-end

Following one user click through every layer:

```
USER CLICKS "Create project" button in <ProjectsView/>
   │
   ▼
   <ProjectsView onCreate={...}/>     (presentation/components)
   │ calls hook returned by:
   ▼
   useCreateProject(viewer)            (presentation/hooks)
   │ uses TanStack useMutation, mutationFn =
   ▼
   projectsApi.createProject(viewer, input)
                                       (container/dependency-container.ts)
   │ which is the function returned by:
   ▼
   makeCreateProject({ repo, analytics })(viewer, input)
                                       (application/use-cases)
   │ executes:
   │   1. requirePermission(viewer, 'projects.create.any')
   │   2. Project.create({ id, name })   ─► (domain)
   │   3. await repo.save(project)       ─► (port)
   │       │
   │       ▼
   │   makeProjectHttpRepository(http).save(project)
   │                                   (infrastructure)
   │       │ calls:
   │       ▼
   │   http.put('/v1/projects/:id', body)
   │                                   (shared/infrastructure/http)
   │       │ the ONE fetch site:
   │       ▼
   │   fetch(`${env.VITE_API_BASE_URL}/v1/projects/:id`, ...)
   │       │
   │       ▼ HTTP request to backend
   │   ┌──────────────────────────────┐
   │   │     BACKEND (the truth)      │
   │   │  authn + authz + persist     │
   │   └──────────────────────────────┘
   │       │ JSON response
   │       ▼
   │   mapper.toDomain(json) ─► Project entity
   │   4. analytics.track('project.created')
   │   5. return { id, name }     ◄── DTO, not entity
   ▼
   useMutation onSuccess: queryClient.invalidateQueries({
     queryKey: projectKeys.byWorkspace(viewer.workspaceId)
   })
   │
   ▼
   useProjectsQuery refetches; <ProjectsView/> re-renders
   with the new list.
```

Every horizontal arrow respects the dependency direction. Every type
that crosses a layer is a DTO. Errors thrown deep get mapped centrally
at the route ErrorBoundary into user-facing copy.

---

## 6. The Feature-Build Loop (build X / Y / Z)

```
        ┌────────────────────────────────────────────────────────┐
        │                  REQUIREMENT                            │
        │  "users can create + list tasks in their workspace"     │
        └─────────────────────────┬──────────────────────────────┘
                                  ▼
   1. DOMAIN           modules/tasks/domain/task.ts
                       Task entity, invariants, branded id
                                  │
                                  ▼
   2. PORT             modules/tasks/application/ports.ts
                       interface TaskRepository { add, listForWs }
                                  │
                                  ▼
   3. USE-CASE         modules/tasks/application/use-cases/
   + TEST              create-task.ts (+ test with mocked ports)
                                  │
                                  ▼
   4. ADAPTER          modules/tasks/infrastructure/
   + MAPPER            task-http-repository.ts · mappers.ts
                                  │
                                  ▼
   5. SCHEMA           modules/tasks/presentation/schemas/
                       taskCreateSchema (Zod)
                                  │
                                  ▼
   6. QUERY KEYS       modules/tasks/application/query-keys.ts
                       taskKeys.byWorkspace(workspaceId)
                                  │
                                  ▼
   7. HOOK             modules/tasks/presentation/hooks/
                       useTasksQuery · useCreateTask
                                  │
                                  ▼
   8. ROUTE + VIEW     app/routes/(workspace)/tasks/page.tsx
                       modules/tasks/presentation/components/
                       tasks-view.tsx · create-task-form.tsx
                                  │
                                  ▼
   9. CONTAINER WIRE   container/dependency-container.ts
                       tasksApi = { createTask, listTasks }
                                  │
                                  ▼
  10. PUBLIC SURFACE   modules/tasks/index.ts (barrel)
                                  │
                                  ▼
  11. GATE             npm run verify
                       (typecheck + lint + test + arch + build + budget)
                                  │
                                  ▼
  12. E2E              e2e/tasks.spec.ts (Playwright)
                                  │
                                  ▼
                             ✅ FEATURE DONE
```

The diff for one feature touches exactly:
- One module's four layer folders (`domain`, `application`,
  `infrastructure`, `presentation`).
- One route file (`app/routes/.../page.tsx`).
- One container line (`tasksApi = ...`).
- One barrel (`modules/tasks/index.ts`).
- Tests.

**Never a horizontal "add a field everywhere" sprawl.** Each feature is a
clean vertical slice.

---

## 7. The gate set — what guards every commit

```
┌─────────────────────────────────────────────────────────────────┐
│  RUN ON EVERY BATCH / PR / push to main                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  npm run typecheck       │ tsc --noEmit (strict + uncheckedIdx) │
│  npm run lint            │ ESLint + boundaries + jsx-a11y       │
│  npm run test            │ vitest + RTL + MSW                   │
│  npm run build           │ vite build                           │
│  npm run budget          │ size-limit (per-chunk caps)          │
│                                                                  │
│  node specs/harness/clean-architecture-report.mjs    ── 0       │
│  node specs/harness/import-boundary-report.mjs       ── EXIT 0  │
│  node specs/harness/godfolder-blocklist.mjs          ── EXIT 0  │
│  node specs/harness/route-inventory.mjs              ── parity  │
│                                                                  │
│  npm run test:e2e        │ playwright critical flows            │
│  + lighthouse-ci against preview URL (LCP/INP/CLS budget)        │
│                                                                  │
│  ALL GREEN = PR mergeable.                                       │
│  RED = stop. Fix. Re-run. Never accumulate violations.           │
└─────────────────────────────────────────────────────────────────┘
```

### What each gate guards

```
godfolder-blocklist.mjs
   ▲
   │ forbids files in src/{components,services,api,utils,helpers,hooks}
   │ (god-folders, post-migration)

import-boundary-report.mjs
   ▲
   │ forbids @/{components,services,api,utils,helpers,hooks}/ imports
   │ (legacy alias ban, forever)

clean-architecture-report.mjs
   ▲
   │ forbids:
   │   • app/presentation/application → /infrastructure/ or container internals
   │   • domain/application → react/router/query/http/sdk
   │   • domain/application/presentation → import.meta.env
   │   • domain/application/presentation/app → bare fetch(
   │   • domain/application → new Headers/Request/URL/XHR

ESLint boundariesConfig
   ▲
   │ same direction, enforced at lint time per-import.
```

---

## 8. The operating rules (apply in every stage)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┃ 1. Code-quality bar holds on every line                       │
│  ┃    (code-quality-standards.md): no any, no silent failures,   │
│  ┃    typed errors, parse-don't-validate, DTOs across boundaries │
│  ┃                                                                │
│  ┃ 2. Ports before adapters                                      │
│  ┃    interface in application → impl in infrastructure → wired  │
│  ┃    in container. Callers depend on the port, never the SDK.   │
│  ┃                                                                │
│  ┃ 3. The composition root is sacred                             │
│  ┃    container/dependency-container.ts is the ONE wiring module │
│  ┃    app/presentation may import.                                │
│  ┃                                                                │
│  ┃ 4. DTOs cross boundaries, HTTP shapes don't                   │
│  ┃    Map JSON → entity → DTO in infra. No raw API records       │
│  ┃    spread as props.                                            │
│  ┃                                                                │
│  ┃ 5. Env is infrastructure                                       │
│  ┃    import.meta.env only in src/config + */infrastructure.     │
│  ┃    VITE_* only — anything else is a build error.              │
│  ┃                                                                │
│  ┃ 6. No business logic in components                             │
│  ┃    Component → hook → use-case (via container) → domain/port. │
│  ┃    That's the only path. fetch in a component is a bug.       │
│  ┃                                                                │
│  ┃ 7. Gate after every batch                                      │
│  ┃    A red gate = stop & fix. Never accumulate violations.       │
│  ┃                                                                │
│  ┃ 8. Read the installed docs                                     │
│  ┃    React 19 / RR v7 / TanStack v5 / Vite versions change the  │
│  ┃    playbook. Verify before recommending.                       │
│  ┃                                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Definition of done (the global gate)

```
                ┌───────────────────────────────────────┐
                │   ALL OF THESE MUST BE TRUE TO SHIP   │
                └────────────────┬──────────────────────┘
                                 │
   ┌─────────────────────────────┼─────────────────────────────┐
   ▼                             ▼                             ▼
┌──────────────┐         ┌─────────────────┐         ┌────────────────┐
│ Architecture │         │   Quality bar   │         │ Production gate│
├──────────────┤         ├─────────────────┤         ├────────────────┤
│ 3 gates = 0  │         │ typecheck ✓     │         │ Web vitals ✓   │
│ AND in CI as │         │ lint  ✓ at ERR  │         │ Lighthouse ≥90 │
│ required     │         │ test  ✓         │         │ Sourcemaps     │
│ checks       │         │ build ✓         │         │   uploaded     │
│              │         │ budget ✓        │         │ CSP + headers  │
│ ESLint layer │         │ a11y lint ✓     │         │ Sentry live    │
│ rules at     │         │ no any / ts-    │         │ E2E green      │
│ ERROR        │         │   ignore        │         │ Rollback ✓     │
│              │         │ no silent fail  │         │ Runbook ✓      │
└──────────────┘         └─────────────────┘         └────────────────┘
                                 │
                                 ▼
                       ╔═══════════════════╗
                       ║  ✅ SHIP IT       ║
                       ╚═══════════════════╝
```

---

## 10. Composes with `gvc`

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│   ┌─────────────┐         ┌──────────────────┐                   │
│   │     gvc     │  ───►   │   sgnk-react     │                   │
│   ├─────────────┤         ├──────────────────┤                   │
│   │ GitHub repo │         │ Architecture     │                   │
│   │ Vercel proj │         │ Features         │                   │
│   │ CF DNS      │         │ Gates            │                   │
│   │ hello-world │         │ CI pipeline      │                   │
│   │ live URL    │         │ Prod-harden      │                   │
│   └─────────────┘         └──────────────────┘                   │
│                                                                   │
│  Typical flow:                                                    │
│    1. $ gvc dashx                  ← creates dashx.sgnk.ai live  │
│    2. $ cd ~/Desktop/GitHub/dashx                                 │
│    3. /sgnk-react create dashx with auth, dashboard, billing      │
│    4. push → preview URL → review → merge → production            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 11. Quick-reference cheatsheet

```
TRIGGER PHRASES
  /sgnk-react                       "restructure my react app"
  /sgnk-react create <name>         "sgnk.ai for react"
  /sgnk-react analyze               "build me a SaaS in react"
                                    "audit my CRA codebase"

RUN A SINGLE GATE
  node specs/harness/clean-architecture-report.mjs
  node specs/harness/import-boundary-report.mjs
  node specs/harness/godfolder-blocklist.mjs
  node specs/harness/route-inventory.mjs

RUN EVERYTHING
  npm run verify
    = typecheck + lint + test + arch + build + budget

SCAFFOLD A NEW PROJECT
  npm create vite@latest <name> -- --template react-ts
  cd <name>
  node ~/.claude/skills/sgnk-react/scripts/scaffold.mjs
  # apply assets, install deps, write spine
  npm run verify          # must be green from commit 1

REFERENCES (loaded on demand)
  Stage 0  → references/analysis-playbook.md
  Stage 1  → references/phase-1-no-godfolder-migration.md
             references/phase-2-conclusive-pass.md
             references/target-structure.md
             references/code-patterns.md
  Stage 2  → references/phase-3-scalability-roadmap.md
  Stage 3  → references/saas-commercialization.md
  Stage 4  → references/production-readiness.md
  Stage 5  → references/deployment-readiness.md
  Always   → references/architecture-rules.md
             references/code-quality-standards.md
  Create   → references/project-starter.md
  Wiring   → references/portability.md
```

---

## 12. The whole engine on one page

```
USER ──► /sgnk-react ──► detect mode ──► CREATE or TRANSFORM
                                              │
                                              ▼
                                  ANALYZE ──► report ──► agreed scope
                                              │
                                              ▼
                                  RESTRUCTURE ──► Phase 1 ──► Phase 2
                                              │      │            │
                                              │      ▼            ▼
                                              │  god-folders   layer leaks
                                              │  deleted       extinct
                                              │      │            │
                                              │      └──── gates green ◄─┐
                                              │                          │
                                              ▼                          │
                                  SCALE (S1–S10) ──── each tagged + gated┤
                                              │                          │
                                              ▼                          │
                                  COMMERCIALIZE ──── tenant + billing +  ┤
                                              │      flags + GDPR        │
                                              ▼                          │
                                  HARDEN ──── auth, CSP, errors,         │
                                              │  telemetry, budget, a11y │
                                              ▼                          │
                                  DEPLOY ──── static host + SPA fallback │
                                              │  + cache + CI + rollback │
                                              ▼                          │
                                            LIVE ◄────── go/no-go ───────┘
```

Every arrow is enforceable. Every stage is reversible (each is additive,
not a rescue). Every line of code holds the same bar. That is the whole
skill in one image.
