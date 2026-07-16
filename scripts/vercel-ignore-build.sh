#!/usr/bin/env bash
# Vercel ignored-build-step guard.
#
# Vercel calls this before clone-deps + build. It must EXIT 0 to SKIP the
# build (deploy reused), or EXIT 1 to PROCEED with the build.
#
# Rules:
#   1. If VERCEL_GIT_PREVIOUS_SHA is empty (first deploy, fresh promote,
#      build cache wipe) → build.
#   2. If the previous sha cannot be resolved in this clone (shallow
#      checkout, force-push, rebased history) → build.
#   3. Otherwise diff the current commit against the previous one and
#      build only when one of the watched paths changed.
#
# Watched paths: anything that affects the deployed artifact. Edits to
# docs/, tests/, src-tauri/, harness scripts, etc. should NOT trigger a
# rebuild — they're already filtered by .vercelignore but we keep the
# allowlist here too as a second layer.

set -u

PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
CUR="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

if [[ -z "$PREV" ]] || ! git cat-file -e "$PREV" 2>/dev/null; then
  echo "[ignore] previous sha missing/unresolvable — building."
  exit 1
fi

# git diff --quiet exits 0 when no diff, 1 when diff. Invert so 'diff
# present → build' (exit 1) and 'no diff → skip' (exit 0).
if git diff --quiet "$PREV" "$CUR" -- \
    src public \
    package.json package-lock.json \
    next.config.ts tsconfig.json \
    eslint.config.mjs postcss.config.mjs \
    vercel.json scripts/vercel-ignore-build.sh \
    .nvmrc 2>/dev/null
then
  echo "[ignore] no watched-path changes — skipping build."
  exit 0
fi

echo "[ignore] watched paths changed — building."
exit 1
