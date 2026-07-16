/**
 * eslint.config.mjs — flat config for sgnk-md.
 *
 * Lints only src/**, specs/**, and root config *.ts/*.mjs.
 * Boundaries layer-violation rules are enforced as "error" (the hexagonal
 * skeleton is stable) so cross-layer imports fail the build.
 */
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  // ── 1. Files to ignore ────────────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      // Static browser assets served as-is — not part of the TS app source
      "public/**",
      // Legacy Obsidian vault — not part of the app
      "**/*.md",
      "md/**",
      // Tauri (Rust) shell — its own toolchain
      "src-tauri/**",
    ],
  },

  // ── 2. JS recommended ────────────────────────────────────────────────────
  js.configs.recommended,

  // ── 3. TypeScript recommended (spread array) ─────────────────────────────
  ...tseslint.configs.recommended,

  // ── 4. Node.js globals for harness + ops scripts ──────────────────────────
  // Pure-Node JS scripts (specs/harness/* and scripts/*) freely use the
  // Node globals — console, process, fetch (Node 18+), Buffer, URL, etc.
  // They are not part of the Next.js bundle, so the browser-strict
  // `no-undef` defaults don't apply.
  {
    files: ["specs/**/*.mjs", "scripts/**/*.{mjs,js}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        queueMicrotask: "readonly",
        globalThis: "readonly",
      },
    },
    rules: {
      // Plain JS — relax TS rules + allow underscore-prefixed unused vars.
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },

  // ── 5. Allow underscore-prefixed intentionally unused vars/params ──────────
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },

  // ── 6. Boundaries — hexagonal layer enforcement ─────────────────────────
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        // Per-module layers
        { type: "domain",                mode: "folder", pattern: "src/modules/*/domain" },
        { type: "application",           mode: "folder", pattern: "src/modules/*/application" },
        { type: "infrastructure",        mode: "folder", pattern: "src/modules/*/infrastructure" },
        { type: "presentation",          mode: "folder", pattern: "src/modules/*/presentation" },
        // Shared kernel
        { type: "shared-domain",         mode: "folder", pattern: "src/shared/domain" },
        { type: "shared-application",    mode: "folder", pattern: "src/shared/application" },
        { type: "shared-infrastructure", mode: "folder", pattern: "src/shared/infrastructure" },
        { type: "shared-presentation",   mode: "folder", pattern: "src/shared/presentation" },
        // Composition + delivery
        { type: "container",             mode: "folder", pattern: "src/container" },
        { type: "config",                mode: "folder", pattern: "src/config" },
        { type: "app",                   mode: "folder", pattern: "src/app" },
        { type: "middleware",            mode: "file",   pattern: "src/proxy.ts" },
      ],
      "boundaries/dependency-nodes": ["import", "dynamic-import"],
    },
    rules: {
      // Architecture boundaries are now enforced as errors (the skeleton is
      // stable). Using v6 object-based selector syntax.
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            // Domain is pure — only imports domain/shared-domain.
            {
              from: { type: ["domain", "shared-domain"] },
              allow: { to: { type: ["domain", "shared-domain"] } },
            },
            // Application orchestrates: domain + application + config. No infra.
            {
              from: { type: ["application", "shared-application"] },
              allow: { to: { type: ["domain", "application", "shared-domain", "shared-application", "config"] } },
            },
            // Presentation renders DTOs. Never infra/container.
            {
              from: { type: ["presentation", "shared-presentation"] },
              allow: { to: { type: ["domain", "application", "presentation", "shared-domain", "shared-application", "shared-presentation"] } },
            },
            // Infrastructure implements ports.
            {
              from: { type: ["infrastructure", "shared-infrastructure"] },
              allow: { to: { type: ["domain", "application", "infrastructure", "shared-domain", "shared-application", "shared-infrastructure", "config"] } },
            },
            // Container wires infra.
            {
              from: { type: "container" },
              allow: { to: { type: ["domain", "application", "infrastructure", "shared-domain", "shared-application", "shared-infrastructure", "container", "config"] } },
            },
            // App delivery: presentation + DTOs + composition root.
            {
              from: { type: "app" },
              allow: { to: { type: ["domain", "application", "presentation", "shared-domain", "shared-application", "shared-presentation", "container", "config", "app"] } },
            },
            // Edge middleware: thin.
            {
              from: { type: "middleware" },
              allow: { to: { type: ["application", "infrastructure", "shared-application", "shared-infrastructure", "config"] } },
            },
            {
              from: { type: "config" },
              allow: { to: { type: "config" } },
            },
          ],
        },
      ],
      // Forever-ban on the deleted god-folders.
      "no-restricted-imports": [
        "error",
        { patterns: ["@/server/*", "@/lib/*", "@/components/*"] },
      ],
    },
  },
];

export default config;
