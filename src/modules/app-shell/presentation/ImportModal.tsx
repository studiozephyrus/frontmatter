"use client";

/**
 * ImportModal — import external markdown files into the vault.
 *
 * Pick one or more .md/.markdown/.txt files; each is read client-side and
 * committed via /api/vault/create (into an optional target folder). Opened via
 * the `sgnk:open-import` window event (command palette).
 */
import { useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Status = { name: string; ok: boolean; detail?: string };

export function ImportModal({ open, onClose }: Props): React.JSX.Element | null {
  const [folder, setFolder] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Status[]>([]);

  if (!open) return null;

  async function importFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setResults([]);
    const out: Status[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f) continue;
      try {
        const text = await f.text();
        const cleanFolder = folder.trim().replace(/^\/+|\/+$/g, "");
        const name = f.name.endsWith(".md") ? f.name : `${f.name.replace(/\.(markdown|txt)$/i, "")}.md`;
        const path = cleanFolder ? `${cleanFolder}/${name}` : name;
        const res = await fetch("/api/vault/create", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ path, content: text }),
        });
        const ok = res.ok || res.status === 409;
        out.push(ok ? { name: path, ok } : { name: path, ok, detail: `${res.status}` });
      } catch (e) {
        out.push({ name: f.name, ok: false, detail: e instanceof Error ? e.message : "error" });
      }
    }
    setResults(out);
    setBusy(false);
    if (out.some((r) => r.ok)) window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
  }

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div onClick={(e) => e.stopPropagation()} className="sgnk-surface sgnk-fade-in" style={{ width: "min(480px, 96vw)", padding: 0 }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <strong style={{ fontSize: 14 }}>Import markdown</strong>
          <button className="sgnk-icon-btn" style={{ marginLeft: "auto" }} onClick={onClose} aria-label="Close"><GoogleIcon name="close" size={16} weight={500} /></button>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            Target folder (optional)
            <input
              className="sgnk-input"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="e.g. Imported"
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
          <label className="sgnk-btn sgnk-btn-primary" style={{ height: 40, cursor: "pointer" }}>
            {busy ? "Importing…" : "Choose .md files"}
            <input
              type="file"
              accept=".md,.markdown,.txt,text/markdown,text/plain"
              multiple
              hidden
              disabled={busy}
              onChange={(e) => void importFiles(e.target.files)}
            />
          </label>
          {results.length > 0 && (
            <ul style={{ fontSize: 12, margin: 0, paddingLeft: 16, maxHeight: 180, overflow: "auto" }}>
              {results.map((r) => (
                <li key={r.name} style={{ color: r.ok ? "var(--success)" : "var(--danger)" }}>
                  {r.ok ? "✓" : "✕"} {r.name} {r.detail ? `(${r.detail})` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
