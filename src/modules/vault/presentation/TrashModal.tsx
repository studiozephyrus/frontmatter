"use client";

/**
 * TrashModal — lists notes under `_Trash/` (soft-deleted) and lets the user
 * restore them to their original location or purge them permanently.
 *
 * Opened via the `sgnk:open-trash` window event (dispatched from the command
 * palette). Restore → POST /api/vault/restore. Purge → fetch current blob sha
 * then POST /api/vault/delete (which hard-deletes paths already in _Trash/).
 */
import { useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import { useSnapshot } from "./use-snapshot";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TRASH = "_Trash/";

export function TrashModal({ open, onClose }: Props): React.JSX.Element | null {
  const { snapshot } = useSnapshot();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const trashed = (snapshot?.notes ?? []).filter((n) => n.path.startsWith(TRASH));

  async function restore(path: string) {
    setBusy(path);
    setError(null);
    try {
      const res = await fetch("/api/vault/restore", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
      } else if (res.status === 409) {
        setError("A note already exists at the original location.");
      } else {
        setError(`Restore failed (${res.status}).`);
      }
    } catch {
      setError("Restore failed — network error.");
    } finally {
      setBusy(null);
    }
  }

  async function purge(path: string) {
    setBusy(path);
    setError(null);
    try {
      const cur = await fetch(`/api/vault/file?path=${encodeURIComponent(path)}`);
      if (!cur.ok) {
        setError(`Delete failed (${cur.status}).`);
        return;
      }
      const baseSha = ((await cur.json()) as { sha?: string }).sha ?? "";
      const res = await fetch("/api/vault/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path, baseSha }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
      } else {
        setError(`Delete failed (${res.status}).`);
      }
    } catch {
      setError("Delete failed — network error.");
    } finally {
      setBusy(null);
    }
  }

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
        style={{ width: "min(560px, 96vw)", maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <strong style={{ fontSize: 14 }}>Trash</strong>
          <span style={{ marginLeft: 8, color: "var(--muted)", fontSize: 12 }}>{trashed.length} items</span>
          <button className="sgnk-icon-btn" style={{ marginLeft: "auto" }} onClick={onClose} aria-label="Close"><GoogleIcon name="close" size={16} weight={500} /></button>
        </div>
        {error && (
          <div role="alert" style={{ padding: "8px 16px", color: "var(--danger)", fontSize: 12, borderBottom: "1px solid var(--border)" }}>
            {error}
          </div>
        )}
        <div style={{ overflowY: "auto", padding: 8 }}>
          {trashed.length === 0 && (
            <div style={{ padding: 16, color: "var(--muted)", fontSize: 13 }}>Trash is empty.</div>
          )}
          {trashed.map((n) => {
            const original = n.path.slice(TRASH.length);
            return (
              <div
                key={n.path}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: "var(--radius-sm)" }}
              >
                <span style={{ flex: 1, fontSize: 13, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {original}
                </span>
                <button className="sgnk-btn" style={{ height: 26 }} disabled={busy === n.path} onClick={() => restore(n.path)}>
                  Restore
                </button>
                <button
                  className="sgnk-btn sgnk-btn-ghost"
                  style={{ height: 26, color: "var(--danger)" }}
                  disabled={busy === n.path}
                  onClick={() => purge(n.path)}
                >
                  Delete forever
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
