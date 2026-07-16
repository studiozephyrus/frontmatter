"use client";

/**
 * DuplicateConflictModal — appears on shell mount when two or more notes
 * share the same public_slug (introduced via Obsidian/git sync that
 * bypassed the UI uniqueness gate). The user MUST resolve each conflict
 * before publishing again — public route stays 404 for conflicted slugs.
 */

import { useEffect, useState, useTransition } from "react";
import type { SlugConflict } from "@/modules/share";
import { suggestSlug, validateSlug } from "@/modules/share/domain/slug";

interface DuplicateConflictModalProps {
  conflicts: readonly SlugConflict[];
  onResolved?: (() => void) | undefined;
}

export function DuplicateConflictModal({ conflicts, onResolved }: DuplicateConflictModalProps) {
  const [open, setOpen] = useState(conflicts.length > 0);
  const [editing, setEditing] = useState<{ path: string; slug: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [remaining, setRemaining] = useState(conflicts);

  useEffect(() => {
    setRemaining(conflicts);
    setOpen(conflicts.length > 0);
  }, [conflicts]);

  if (!open || remaining.length === 0) return null;

  function startRename(path: string, current: string) {
    const fileBase = path.split("/").pop()?.replace(/\.md$/i, "") ?? current;
    setEditing({ path, slug: `${suggestSlug(fileBase)}-2` });
    setError(null);
  }

  async function applyRename() {
    if (!editing) return;
    try { validateSlug(editing.slug); } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid slug"); return;
    }
    startTransition(async () => {
      const res = await fetch("/api/share", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: editing.path, slug: editing.slug }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { detail?: string; conflictPath?: string };
        setError(body.conflictPath ? `Taken by ${body.conflictPath}` : (body.detail ?? "Rename failed"));
        return;
      }
      // Refetch conflicts; if list empties, close.
      const r2 = await fetch("/api/share/conflicts");
      const next = (r2.ok ? (await r2.json()).conflicts : []) as SlugConflict[];
      setRemaining(next);
      setEditing(null);
      setError(null);
      if (next.length === 0) { setOpen(false); onResolved?.(); }
    });
  }

  async function unpublish(path: string) {
    startTransition(async () => {
      await fetch("/api/share", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ path }) });
      const r2 = await fetch("/api/share/conflicts");
      const next = (r2.ok ? (await r2.json()).conflicts : []) as SlugConflict[];
      setRemaining(next);
      if (next.length === 0) { setOpen(false); onResolved?.(); }
    });
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Duplicate public slugs" style={overlayStyle}>
      <div style={modalStyle}>
        <header style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Duplicate public slugs detected</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>
            A sync from Obsidian or Git pushed notes that claim the same
            <code style={inlineCode}>public_slug</code>. The public URL stays
            hidden until each slug is unique. Rename one or unpublish it.
          </p>
        </header>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16, maxHeight: "60vh", overflowY: "auto" }}>
          {remaining.map((c) => (
            <li key={c.slug} style={{ border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 8, padding: 12 }}>
              <p style={{ margin: 0, fontSize: 14 }}>
                Slug <code style={inlineCode}>/{c.slug}</code> claimed by {c.notes.length} notes:
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexDirection: "column", gap: 6 }}>
                {c.notes.map((n) => (
                  <li key={n.path} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 13 }}>
                      <strong>{n.title}</strong>
                      <span style={{ opacity: 0.6, marginLeft: 6, fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}>{n.path}</span>
                    </span>
                    <span style={{ display: "flex", gap: 6 }}>
                      <button type="button" onClick={() => startRename(n.path, c.slug)} style={primaryButton}>Rename</button>
                      <button type="button" onClick={() => unpublish(n.path)} style={secondaryButton}>Unpublish</button>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {editing && (
          <div style={{ marginTop: 16, padding: 12, border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 8, background: "var(--surface-2, #0f1011)" }}>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
              New slug for <code style={inlineCode}>{editing.path}</code>:
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 14, opacity: 0.6, alignSelf: "center" }}>/</span>
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                style={inputStyle}
                autoFocus
              />
              <button type="button" onClick={applyRename} disabled={pending} style={primaryButton}>{pending ? "Saving…" : "Apply"}</button>
              <button type="button" onClick={() => { setEditing(null); setError(null); }} disabled={pending} style={secondaryButton}>Cancel</button>
            </div>
            {error && <p role="alert" style={{ ...errorStyle, marginTop: 8 }}>{error}</p>}
          </div>
        )}

        <p style={{ marginTop: 16, fontSize: 12, opacity: 0.6 }}>
          You can also dismiss this dialog and fix the duplicates later — public URLs stay 404 until resolved.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button type="button" onClick={() => setOpen(false)} style={secondaryButton}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "grid", placeItems: "center", zIndex: 1100 };
const modalStyle: React.CSSProperties = { width: "min(640px, 94vw)", maxHeight: "85vh", overflow: "auto", background: "var(--surface-1, #16181d)", color: "var(--ink, #e9ecf2)", border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 12, padding: 24, boxShadow: "0 10px 40px rgba(0,0,0,.4)" };
const inputStyle: React.CSSProperties = { flex: 1, padding: "8px 10px", background: "var(--surface-1, #16181d)", color: "inherit", border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 6, fontFamily: "var(--font-mono, monospace)", fontSize: 14 };
const inlineCode: React.CSSProperties = { background: "var(--surface-2, #0f1011)", padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-mono, monospace)", fontSize: 12 };
const errorStyle: React.CSSProperties = { padding: "8px 10px", border: "1px solid rgba(239,68,68,.4)", borderRadius: 6, background: "rgba(239,68,68,.08)", fontSize: 13 };
const primaryButton: React.CSSProperties = { padding: "6px 12px", background: "var(--primary, #5e6ad2)", color: "#fff", border: 0, borderRadius: 6, fontSize: 13, cursor: "pointer" };
const secondaryButton: React.CSSProperties = { padding: "6px 12px", background: "transparent", color: "inherit", border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 6, fontSize: 13, cursor: "pointer" };
