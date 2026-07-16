"use client";

/**
 * ShareModal — pick a public slug for the active note.
 *
 * Server is the authority on uniqueness; this modal surfaces the 409
 * `slug_conflict` response (existing path) and the 422 `invalid_slug`
 * (format) cleanly. Optimistic suggest derived from the page title.
 */

import { useEffect, useState, useTransition } from "react";
import { suggestSlug } from "@/modules/share/domain/slug";

interface ShareModalProps {
  open: boolean;
  notePath: string;
  noteTitle: string;
  currentSlug?: string | undefined;
  onClose: () => void;
  onShared?: ((result: { slug: string; publicUrl: string }) => void) | undefined;
  onUnshared?: (() => void) | undefined;
}

type ApiError =
  | { error: "slug_conflict"; slug: string; conflictPath: string; detail: string }
  | { error: "invalid_slug"; detail: string }
  | { error: string; detail?: string };

export function ShareModal({
  open, notePath, noteTitle, currentSlug, onClose, onShared, onUnshared,
}: ShareModalProps) {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<{ slug: string; path: string } | null>(null);
  const [shared, setShared] = useState<{ slug: string; url: string } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setSlug(currentSlug ?? suggestSlug(noteTitle));
    setError(null); setConflict(null); setShared(null);
  }, [open, currentSlug, noteTitle]);

  if (!open) return null;

  async function submit() {
    setError(null); setConflict(null);
    startTransition(async () => {
      const res = await fetch("/api/share", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: notePath, slug }),
      });
      if (res.ok) {
        const data = await res.json() as { slug: string; publicUrl: string };
        setShared({ slug: data.slug, url: data.publicUrl });
        onShared?.(data);
        return;
      }
      const body = await res.json().catch(() => ({})) as ApiError;
      if (body.error === "slug_conflict" && "conflictPath" in body) {
        setConflict({ slug: body.slug, path: body.conflictPath });
        setError(`Slug "${body.slug}" is already used by ${body.conflictPath}. Pick a different one.`);
        return;
      }
      setError(body.detail ?? "Failed to share. Try again.");
    });
  }

  async function unshare() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/share", {
        method: "DELETE", headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: notePath }),
      });
      if (res.ok) { onUnshared?.(); onClose(); return; }
      const body = await res.json().catch(() => ({})) as ApiError;
      setError(body.detail ?? "Failed to unpublish.");
    });
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Share note" style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <header style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Share publicly</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.7 }}>
            Anyone with the URL can read this note. The slug is the part after
            <code style={inlineCode}>/</code>. It can differ from the page title.
          </p>
        </header>

        <label style={{ display: "block", fontSize: 13, marginBottom: 6, opacity: 0.8 }}>Public slug</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, opacity: 0.6 }}>/</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-public-note"
            style={inputStyle}
            disabled={pending}
            autoFocus
          />
        </div>

        {error && (
          <p role="alert" style={errorStyle}>{error}{conflict && <>
            {" "}<button type="button" onClick={() => setSlug(`${conflict.slug}-2`)} style={inlineButton}>Try {conflict.slug}-2</button>
          </>}</p>
        )}

        {shared && (
          <div style={successStyle}>
            <p style={{ margin: 0, fontSize: 13 }}>Public URL</p>
            <p style={{ margin: "4px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
              <code style={{ ...inlineCode, padding: "4px 8px" }}>{shared.url}</code>
              <button type="button" onClick={() => navigator.clipboard.writeText(shared.url)} style={inlineButton}>Copy</button>
              <a href={shared.url} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>Open ↗</a>
            </p>
          </div>
        )}

        <footer style={{ marginTop: 24, display: "flex", justifyContent: "space-between", gap: 8 }}>
          <div>
            {currentSlug && (
              <button type="button" onClick={unshare} disabled={pending} style={dangerButton}>Unpublish</button>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} disabled={pending} style={secondaryButton}>Close</button>
            <button type="button" onClick={submit} disabled={pending || slug.length === 0} style={primaryButton}>
              {pending ? "Saving…" : currentSlug === slug ? "Already shared" : currentSlug ? "Update slug" : "Share"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ─── inline styles (no global CSS dependency) ─────────────────────────────
const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "grid", placeItems: "center", zIndex: 1000 };
const modalStyle: React.CSSProperties = { width: "min(520px, 92vw)", background: "var(--surface-1, #16181d)", color: "var(--ink, #e9ecf2)", border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 12, padding: 24, boxShadow: "0 10px 40px rgba(0,0,0,.4)" };
const inputStyle: React.CSSProperties = { flex: 1, padding: "8px 10px", background: "var(--surface-2, #0f1011)", color: "inherit", border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 6, fontFamily: "var(--font-mono, monospace)", fontSize: 14 };
const inlineCode: React.CSSProperties = { background: "var(--surface-2, #0f1011)", padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-mono, monospace)", fontSize: 12 };
const errorStyle: React.CSSProperties = { marginTop: 12, padding: "10px 12px", border: "1px solid rgba(239,68,68,.4)", borderRadius: 6, background: "rgba(239,68,68,.08)", fontSize: 13 };
const successStyle: React.CSSProperties = { marginTop: 16, padding: "10px 12px", border: "1px solid rgba(39,166,68,.4)", borderRadius: 6, background: "rgba(39,166,68,.08)" };
const primaryButton: React.CSSProperties = { padding: "8px 14px", background: "var(--primary, #5e6ad2)", color: "#fff", border: 0, borderRadius: 6, fontSize: 14, cursor: "pointer" };
const secondaryButton: React.CSSProperties = { padding: "8px 14px", background: "transparent", color: "inherit", border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 6, fontSize: 14, cursor: "pointer" };
const dangerButton: React.CSSProperties = { padding: "8px 14px", background: "transparent", color: "rgba(239,68,68,.9)", border: "1px solid rgba(239,68,68,.4)", borderRadius: 6, fontSize: 14, cursor: "pointer" };
const inlineButton: React.CSSProperties = { padding: "2px 8px", background: "transparent", color: "inherit", border: "1px solid var(--hairline, #2a2a2a)", borderRadius: 4, fontSize: 12, cursor: "pointer" };
