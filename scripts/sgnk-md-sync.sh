#!/bin/zsh
# sgnk-md local sync routine.
# Keeps local `main` in sync with origin/main (md.sgnk.ai web-editor commits):
# pulls remote commits down, pushes any local main commits up.
#
# Branch-aware & conflict-safe:
#   * If the repo is checked out on `main`, it rebases + pushes as before, and
#     ABORTS cleanly on a rebase conflict (notifies, never force-resolves).
#   * If the repo is on ANY OTHER branch (e.g. an active stabilize/* working
#     branch), it fast-forwards the local `main` REF from origin/main WITHOUT
#     touching the working tree — so untracked vault files can never block it,
#     and in-flight uncommitted work on the working branch is never disturbed.
#
# Run on a schedule by the launchd agent ~/Library/LaunchAgents/ai.sgnk.md-sync.plist.

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
REPO="/Users/sagnikmitra/Desktop/GitHub/md"
LOG="$REPO/.sgnk-md-sync.log"

cd "$REPO" 2>/dev/null || exit 1

# Keep the log from growing unbounded (last ~500 lines).
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 500 ]; then
  tail -n 200 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

notify() {
  osascript -e "display notification \"$1\" with title \"sgnk-md sync\"" 2>/dev/null || true
}

{
  echo "=== $(date '+%Y-%m-%d %H:%M:%S') sgnk-md sync ==="
  git fetch origin --quiet 2>&1

  CUR="$(git symbolic-ref --short -q HEAD)"

  if [ "$CUR" = "main" ]; then
    # On main: pull web-editor commits in, replaying any local main commits.
    if git pull --rebase --autostash origin main 2>&1; then
      git push origin main 2>&1 || echo "push: nothing to push or push failed"
      echo "sync ok (on main)"
    else
      echo "CONFLICT: rebase failed — aborting to keep the working tree clean."
      git rebase --abort 2>&1 || true
      notify "Pull conflict — resolve ~/Desktop/GitHub/md manually"
    fi
  else
    # On a working branch (main not checked out here): mirror the main ref only.
    # `fetch origin main:main` is fast-forward-only; it refuses (non-zero) if the
    # local main has diverged — we surface that for manual review instead of
    # forcing. The working tree is never touched.
    if git fetch origin main:main 2>&1; then
      echo "main fast-forwarded to origin/main (working branch '$CUR' untouched)"
    else
      echo "WARN: local main diverged from origin/main — manual review needed."
      notify "Local main diverged from origin/main — review ~/Desktop/GitHub/md"
    fi
    # Push any local main commits that are ahead of origin/main (no-op if none).
    if [ -n "$(git rev-list origin/main..main 2>/dev/null)" ]; then
      git push origin main 2>&1 || echo "push: push failed"
    fi
    echo "sync ok (main mirrored; on '$CUR')"
  fi
} >> "$LOG" 2>&1
