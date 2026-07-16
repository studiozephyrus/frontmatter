"use client";

/**
 * HistoryModal — version history viewer for the active note.
 *
 * Lists git commits that touched the note (via /api/vault/history), previews
 * the note's content at any selected commit (/api/vault/version), and can
 * restore a past version (commits the old content over current HEAD through
 * /api/commit, using the note's live blob sha as baseSha for OCC safety).
 */
import { useCallback, useEffect, useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import { useEditorStore } from "@/modules/editor/presentation/editor-store";
import { deleteDraft } from "@/modules/drafts";

type Commit = { sha: string; message: string; author: string; date: string | null };

interface Props {
  path: string;
  open: boolean;
  onClose: () => void;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function HistoryModal({ path, open, onClose }: Props): React.JSX.Element | null {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setSelected(null);
    setPreview("");
    fetch(`/api/vault/history?path=${encodeURIComponent(path)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        return (await r.json()) as { commits?: Commit[] };
      })
      .then((d) => setCommits(d.commits ?? []))
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, [open, path]);

  const selectCommit = useCallback(
    (sha: string) => {
      setSelected(sha);
      setPreview("");
      fetch(`/api/vault/version?path=${encodeURIComponent(path)}&sha=${encodeURIComponent(sha)}`)
        .then(async (r) => {
          if (!r.ok) throw new Error(String(r.status));
          return (await r.json()) as { content?: string };
        })
        .then((d) => setPreview(d.content ?? ""))
        .catch(() => setError("Failed to load version"));
    },
    [path],
  );

  async function restore() {
    if (selected === null) return;
    setBusy(true);
    setError(null);
    try {
      // Current blob sha for OCC.
      const cur = await fetch(`/api/vault/file?path=${encodeURIComponent(path)}`).then((r) => r.json());
      const baseSha = (cur as { sha?: string }).sha ?? "";
      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          files: [{ path, content: preview, baseSha }],
          message: `Restore ${path.split("/").pop()} to ${selected.slice(0, 7)}`,
        }),
      });
      if (!res.ok) {
        setError(`Restore failed (${res.status})`);
        setBusy(false);
        return;
      }
      // The restored content is now committed at HEAD. Drop any stale draft
      // (so the dirty index doesn't lie), reflect it in the store, and force
      // the editor to remount → refetch fresh content + the new blob sha.
      const store = useEditorStore.getState();
      store.setContent(path, preview);
      store.setDirty(path, false);
      await deleteDraft(path);
      store.bumpReload(path);
      window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
      setBusy(false);
      onClose();
    } catch {
      setError("Restore failed");
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sgnk-surface sgnk-fade-in"
        style={{ width: "min(900px, 96vw)", height: "min(640px, 90vh)", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <strong style={{ fontSize: 14 }}>Version history</strong>
          <span style={{ marginLeft: 8, color: "var(--muted)", fontSize: 12 }}>{path}</span>
          <button className="sgnk-icon-btn" style={{ marginLeft: "auto" }} onClick={onClose} aria-label="Close"><GoogleIcon name="close" size={16} weight={500} /></button>
        </div>
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* Commit list */}
          <div style={{ width: 300, borderRight: "1px solid var(--border)", overflowY: "auto", flexShrink: 0 }}>
            {loading && <div style={{ padding: 16, color: "var(--muted)", fontSize: 13 }}>Loading…</div>}
            {!loading && commits.length === 0 && (
              <div style={{ padding: 16, color: "var(--muted)", fontSize: 13 }}>No history yet.</div>
            )}
            {commits.map((c) => (
              <button
                key={c.sha}
                onClick={() => selectCommit(c.sha)}
                className="sgnk-tree-row"
                data-active={selected === c.sha || undefined}
                style={{ flexDirection: "column", alignItems: "flex-start", gap: 2, padding: "8px 12px" }}
              >
                <span style={{ fontSize: 12, color: "var(--fg)", fontWeight: 500, whiteSpace: "normal", textAlign: "left" }}>
                  {c.message.split("\n")[0]}
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {c.author} · {fmtDate(c.date)} · {c.sha.slice(0, 7)}
                </span>
              </button>
            ))}
          </div>
          {/* Preview */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <pre
              style={{
                flex: 1,
                margin: 0,
                overflow: "auto",
                padding: 16,
                fontSize: 12.5,
                fontFamily: "var(--font-mono)",
                whiteSpace: "pre-wrap",
                color: "var(--fg)",
              }}
            >
              {selected ? preview || "Loading version…" : "Select a version to preview."}
            </pre>
            {error && <div style={{ padding: "6px 16px", color: "var(--danger)", fontSize: 12 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "10px 16px", borderTop: "1px solid var(--border)" }}>
              <button className="sgnk-btn" onClick={onClose}>
                Close
              </button>
              <button className="sgnk-btn sgnk-btn-primary" disabled={selected === null || busy} onClick={restore}>
                {busy ? "Restoring…" : "Restore this version"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
