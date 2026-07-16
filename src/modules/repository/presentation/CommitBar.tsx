"use client";

/**
 * CommitBar — compact header island for committing dirty drafts to GitHub.
 *
 * Design notes:
 * - Uses a stable `tabs` selector + useMemo to union editor-dirty paths with
 *   the localStorage dirty index, avoiding the "new object every render" trap
 *   (B4 incident: never return new object/array/Set directly from Zustand selector).
 * - On successful commit we no longer reload the page. Instead we:
 *     1. deleteDraft + setDirty(false) for each committed path (clears dirty flags).
 *     2. Dispatch "sgnk:vault-changed" so the shared SnapshotProvider re-fetches.
 *   Tabs stay open; the editor reloads committed content via use-note-content.
 */

import { useEffect, useMemo, useState } from "react";
import { useEditorStore } from "@/modules/editor";
import { deleteDraft, getDraft, listDirtyPaths, saveDraft } from "@/modules/drafts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CommitStatus =
  | { kind: "idle" }
  | { kind: "inflight" }
  | { kind: "success" }
  | { kind: "conflict"; paths: string[] }
  | { kind: "auth-error" }
  | { kind: "error"; message: string };

// ---------------------------------------------------------------------------
// Commit API payload types
// ---------------------------------------------------------------------------

interface CommitFile {
  path: string;
  content: string;
  baseSha: string;
}

// ---------------------------------------------------------------------------
// CommitBar
// ---------------------------------------------------------------------------

export function CommitBar() {
  // Stable selector: `tabs` array ref only changes when Zustand emits a new
  // state. We never return a derived value here — just the stored reference.
  const tabs = useEditorStore((s) => s.tabs);

  // Paths from IndexedDB dirty index (covers notes not currently open in tabs).
  // FIX G: re-read whenever `tabs` changes (catches saves after 409 conflict / any
  // write that updates the dirty index without a page reload).
  const [indexPaths, setIndexPaths] = useState<readonly string[]>([]);

  useEffect(() => {
    // listDirtyPaths() reads localStorage synchronously — safe on every tabs change
    setIndexPaths(listDirtyPaths());
  }, [tabs]); // tabs identity changes exactly when a dirty flag changes

  // Union of editor-dirty tab paths and IndexedDB dirty-index paths.
  // useMemo to avoid producing a new Set/array on every render.
  const dirtyPaths = useMemo<readonly string[]>(() => {
    const set = new Set<string>(indexPaths);
    for (const tab of tabs) {
      if (tab.dirty) set.add(tab.path);
    }
    return Array.from(set);
  }, [tabs, indexPaths]);

  const count = dirtyPaths.length;
  const defaultMessage = `Update ${count} note(s) via sgnk-md`;

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<CommitStatus>({ kind: "idle" });

  const inflight = status.kind === "inflight";
  const disabled = count === 0 || inflight;

  async function handleCommit() {
    setStatus({ kind: "inflight" });

    try {
      // Gather file payloads — skip paths with no draft saved yet
      const files: CommitFile[] = [];
      for (const path of dirtyPaths) {
        const draft = await getDraft(path);
        if (draft) {
          files.push({ path, content: draft.content, baseSha: draft.baseSha });
        }
      }

      if (files.length === 0) {
        setStatus({ kind: "idle" });
        return;
      }

      const commitMessage = message.trim() || defaultMessage;

      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, message: commitMessage }),
      });

      if (res.ok) {
        // Clean up committed drafts and clear dirty flags
        for (const f of files) {
          await deleteDraft(f.path);
          useEditorStore.getState().setDirty(f.path, false);
        }
        // Re-read dirty index so the count reflects the cleared state
        setIndexPaths(listDirtyPaths());
        setStatus({ kind: "success" });
        // Notify the shared SnapshotProvider to re-fetch without a page reload.
        // Tabs remain open; dirty flags are already cleared above.
        window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
        return;
      }

      if (res.status === 409) {
        const body = (await res.json()) as { error: string; paths?: string[] };
        setIndexPaths(listDirtyPaths());
        setStatus({ kind: "conflict", paths: body.paths ?? [] });
        return;
      }

      if (res.status === 401) {
        setStatus({ kind: "auth-error" });
        return;
      }

      // 400 / 502 / other
      let errMsg = `HTTP ${res.status}`;
      try {
        const body = (await res.json()) as { error?: string };
        if (body.error) errMsg = body.error;
      } catch {
        /* ignore parse error */
      }
      setStatus({ kind: "error", message: errMsg });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setStatus({ kind: "error", message: msg });
    }
  }

  /**
   * Conflict resolver — 3-way MERGE (the non-destructive default). For each
   * conflicting path, ask the server to merge local against the current remote
   * over their common base; adopt the merged text + fresh remote sha into the
   * draft and the open editor. A clean merge commits automatically; a real
   * conflict leaves git-style markers in the note for the user to resolve.
   */
  async function smartMerge(paths: readonly string[]) {
    setStatus({ kind: "inflight" });
    try {
      let totalConflicts = 0;
      for (const path of paths) {
        const draft = await getDraft(path);
        if (!draft) continue;
        const r = await fetch("/api/vault/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, baseSha: draft.baseSha, localContent: draft.content }),
        });
        if (!r.ok) throw new Error(`merge failed for ${path}: ${r.status}`);
        const j = (await r.json()) as { clean: boolean; text: string; remoteSha: string; conflicts: number };
        // Adopt the merge: persist the draft + refresh the open editor.
        await saveDraft(path, { content: j.text, baseSha: j.remoteSha });
        useEditorStore.getState().setContent(path, j.text);
        useEditorStore.getState().setBaseSha(path, j.remoteSha);
        useEditorStore.getState().bumpReload(path); // remount editor → show merged text
        if (!j.clean) totalConflicts += j.conflicts;
      }
      setIndexPaths(listDirtyPaths());
      if (totalConflicts > 0) {
        setStatus({
          kind: "error",
          message: `Merged with ${totalConflicts} conflict${totalConflicts === 1 ? "" : "s"} — resolve the «<<<<<<< local» markers, then commit`,
        });
      } else {
        await handleCommit(); // clean merge → baseSha now matches remote, commit succeeds
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Merge failed";
      setStatus({ kind: "error", message: msg });
    }
  }

  /**
   * Conflict resolver — keep local content, refresh baseSha, retry commit.
   * "My edits win."
   */
  async function overwriteRemote(paths: readonly string[]) {
    setStatus({ kind: "inflight" });
    try {
      for (const path of paths) {
        const r = await fetch(`/api/vault/file?path=${encodeURIComponent(path)}`);
        if (!r.ok) throw new Error(`refresh failed for ${path}: ${r.status}`);
        const j = (await r.json()) as { sha: string };
        const draft = await getDraft(path);
        if (!draft) continue;
        await saveDraft(path, { content: draft.content, baseSha: j.sha });
      }
      await handleCommit();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Refresh failed";
      setStatus({ kind: "error", message: msg });
    }
  }

  /**
   * Conflict resolver — drop local edits, pull remote.
   * "Remote wins; discard my changes."
   */
  async function discardLocal(paths: readonly string[]) {
    setStatus({ kind: "inflight" });
    try {
      for (const path of paths) {
        await deleteDraft(path);
        useEditorStore.getState().setDirty(path, false);
      }
      setIndexPaths(listDirtyPaths());
      window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
      setStatus({ kind: "idle" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Discard failed";
      setStatus({ kind: "error", message: msg });
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
      }}
    >
      {/* Dirty count badge */}
      <span
        className="sgnk-chip hidden sm:inline-flex"
        style={{
          color: count > 0 ? "var(--fg)" : "var(--muted)",
          borderColor: count > 0 ? "var(--accent)" : "var(--border)",
          background: count > 0 ? "var(--accent-soft)" : "var(--panel-2)",
        }}
      >
        {count > 0 ? (
          <>
            <span style={{ color: "var(--accent)", fontSize: "8px" }}>●</span>
            {count} uncommitted
          </>
        ) : (
          "up to date"
        )}
      </span>

      {/* Commit message input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={defaultMessage}
        aria-label="Commit message"
        disabled={inflight}
        className="sgnk-input hidden md:block"
        style={{ width: "240px", opacity: inflight ? 0.6 : 1 }}
      />

      {/* Commit button */}
      <button
        onClick={handleCommit}
        disabled={disabled}
        className="sgnk-btn sgnk-btn-primary"
      >
        {inflight ? "Committing…" : "Commit"}
      </button>

      {/* Status messages */}
      {status.kind === "conflict" && (
        <span
          style={{ fontSize: "0.7rem", color: "var(--fg)", display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap", maxWidth: 360 }}
        >
          <span style={{ opacity: 0.85 }}>
            Conflict on {status.paths.length} file{status.paths.length === 1 ? "" : "s"}:
          </span>
          <span style={{ opacity: 0.7 }} title={status.paths.join("\n")}>
            {status.paths.slice(0, 2).map((p) => p.split("/").pop()).join(", ")}
            {status.paths.length > 2 ? ` +${status.paths.length - 2}` : ""}
          </span>
          <button
            onClick={() => smartMerge(status.paths)}
            className="sgnk-btn sgnk-btn-primary"
            style={{ fontSize: "0.7rem", padding: "2px 8px" }}
            title="Merge your edits with the remote changes (3-way). Clean merges commit automatically; real conflicts get markers to resolve."
          >
            Merge
          </button>
          <button
            onClick={() => overwriteRemote(status.paths)}
            className="sgnk-btn"
            style={{ fontSize: "0.7rem", padding: "2px 8px" }}
            title="Keep your edits, refresh baseSha, retry commit. Overwrites remote changes for these files."
          >
            Overwrite remote
          </button>
          <button
            onClick={() => discardLocal(status.paths)}
            className="sgnk-btn"
            style={{ fontSize: "0.7rem", padding: "2px 8px" }}
            title="Discard your local edits and pull the remote version into the editor."
          >
            Discard mine
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.7rem", padding: 0, textDecoration: "underline" }}
            title="Reload the whole page (legacy behavior)."
          >
            Reload
          </button>
        </span>
      )}

      {status.kind === "auth-error" && (
        <span style={{ fontSize: "0.7rem", color: "var(--fg)" }}>
          Session expired — sign in again
        </span>
      )}

      {status.kind === "error" && (
        <span style={{ fontSize: "0.7rem", color: "var(--fg)" }}>
          {status.message}
        </span>
      )}

      {status.kind === "success" && (
        <span style={{ fontSize: "0.7rem", color: "var(--fg)" }}>
          Committed!
        </span>
      )}
    </div>
  );
}
