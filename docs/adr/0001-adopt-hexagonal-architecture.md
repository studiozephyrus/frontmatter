# ADR-0001: Adopt Hexagonal Modular-Monolith Architecture

- **Status:** Accepted
- **Date:** 2026-05-25
- **Deciders:** Sagnik Mitra

## Context

sgnk-md is an Obsidian-style web editor — a note-taking and knowledge-management
app that needs to remain maintainable as features grow (offline support, real-time
sync, plugin system, auth). The codebase starts greenfield with Next.js App Router,
TypeScript, and a single developer. Without clear layer boundaries, the typical
Next.js project drifts toward god-folder patterns (`/lib`, `/components`, `/server`)
that couple presentation to infrastructure and make testing and refactoring painful.

## Decision

We will adopt a hexagonal (ports and adapters) modular-monolith structure enforced
by automated gates in CI:

- `src/modules/<name>/{domain,application,infrastructure,presentation}` — one folder
  per bounded context; cross-module imports go through `index.ts` only.
- `src/shared/{domain,application,infrastructure,presentation}` — shared primitives
  that travel the same layer rules.
- `src/container/dependency-container.ts` — the single composition root; the only
  place where infrastructure is wired into use-cases.
- `src/config/env.ts` — typed validated env; the only place (with infrastructure)
  that reads `process.env`.
- Gates enforced by `specs/harness/clean-architecture-report.mjs` (layer-direction
  violations), `import-boundary-report.mjs`, and `server-folder-blocklist.mjs`.
  All gates must report **0 violations** in CI.

## Alternatives considered

- **Flat Next.js convention (`/app`, `/lib`, `/components`)** — familiar but
  encourages coupling; no enforcement mechanism.
- **Strict DDD with separate packages (Nx/Turborepo monorepo)** — stronger
  isolation but heavyweight for a single developer starting from zero.
- **Hexagonal monolith (chosen)** — enforces layer rules statically, scales to
  microservices extraction later, fits one-developer pace now.

## Consequences

- **Positive:** Layer violations are caught at commit and CI; the codebase
  stays testable and decoupled from day one; infrastructure can be swapped
  (e.g. Supabase → PlanetScale) without touching domain logic.
- **Negative / trade-offs:** More directories and ceremony than a flat layout;
  new contributors need a brief orientation.
- **Follow-ups:**
  - ADR-0002 when choosing the persistence adapter (Supabase vs. local SQLite for
    offline).
  - Flip `boundaries/dependencies` ESLint rule from `warn` → `error` once the
    skeleton stabilises (after Batch 1).
  - Add module-encapsulation rule (cross-module must go through `index.ts`) when
    the second module is added.
