"use client";

/**
 * SearchPanel — global search across the vault.
 *
 * One input, four result types, filterable by scope chip:
 *   • Titles   — fuzzy match on note basename / title (client)
 *   • Body     — full-text MiniSearch via /api/vault/search (server)
 *   • Tags     — exact match on snapshot.notes.tags (client)
 *   • Folders  — exact match on every folder in the tree (client)
 *
 * Server is the authority for body (it parses every note); titles/tags/folders
 * are computed from the in-memory snapshot so they're instant. Combining them
 * in one view matches Obsidian's "Search" pane.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useEditorStore } from "@/modules/editor";
import { useSnapshot } from "@/modules/vault";
import { fuzzyFilter } from "./fuzzy";
import type { TreeNode } from "@/modules/vault";

interface BodyHit {
  path: string;
  title: string;
  snippet: string;
}

type ResultRow =
  | { kind: "title"; path: string; title: string }
  | { kind: "body"; path: string; title: string; snippet: string }
  | { kind: "tag"; tag: string; notePaths: readonly string[] }
  | { kind: "folder"; path: string };

type Scope = "all" | "title" | "body" | "tag" | "folder";

interface SearchPanelProps { open: boolean; onClose: () => void }

function useDebounce(value: string, delayMs: number): string {
  const [d, setD] = useState(value);
  useEffect(() => { const id = setTimeout(() => setD(value), delayMs); return () => clearTimeout(id); }, [value, delayMs]);
  return d;
}

function collectFolders(node: TreeNode, out: string[] = []): string[] {
  if (!node.children) return out;
  for (const child of node.children) {
    if (child.type === "folder") {
      if (child.path) out.push(child.path);
      collectFolders(child, out);
    }
  }
  return out;
}

export function SearchPanel({ open, onClose }: SearchPanelProps): React.ReactNode {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [bodyHits, setBodyHits] = useState<readonly BodyHit[]>([]);
  const [bodyLoading, setBodyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 220);
  const { snapshot } = useSnapshot();

  useEffect(() => {
    if (open) {
      // A tag chip (right pane) can preset the search via sessionStorage.
      let preset = "";
      try {
        preset = sessionStorage.getItem("sgnk:search-preset") ?? "";
        if (preset) sessionStorage.removeItem("sgnk:search-preset");
      } catch {
        /* ignore */
      }
      setQuery(preset); setBodyHits([]); setError(null); setHighlighted(0);
      setScope(preset.startsWith("#") ? "tag" : "all");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Server full-text fetch
  useEffect(() => {
    if (!debouncedQuery.trim()) { setBodyHits([]); setError(null); setBodyLoading(false); return; }
    let cancelled = false;
    setBodyLoading(true); setError(null);
    fetch(`/api/vault/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data = (await res.json()) as { results: BodyHit[] };
        if (!cancelled) { setBodyHits(data.results); setBodyLoading(false); }
      })
      .catch((e: unknown) => {
        if (!cancelled) { setError(e instanceof Error ? e.message : "Search failed"); setBodyLoading(false); }
      });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Client-side title / tag / folder matches
  const { titleHits, tagHits, folderHits } = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!snapshot || !q) return { titleHits: [], tagHits: [], folderHits: [] };
    const titleMatches = fuzzyFilter(snapshot.notes, q, (n) => n.title).slice(0, 30);
    // Tags — exact + prefix match
    const tagMap = new Map<string, string[]>();
    for (const n of snapshot.notes) {
      for (const t of n.tags) {
        if (!t.toLowerCase().includes(q)) continue;
        const arr = tagMap.get(t) ?? [];
        arr.push(n.path);
        tagMap.set(t, arr);
      }
    }
    const tagMatches = [...tagMap.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(0, 20).map(([tag, notePaths]) => ({ tag, notePaths }));
    // Folders — name contains
    const folders = collectFolders(snapshot.tree).filter((f) => f.toLowerCase().includes(q)).slice(0, 20);
    return { titleHits: titleMatches, tagHits: tagMatches, folderHits: folders };
  }, [snapshot, debouncedQuery]);

  // Merge into a single ordered list, respecting the scope filter.
  const rows: ResultRow[] = useMemo(() => {
    const out: ResultRow[] = [];
    if (scope === "all" || scope === "title") {
      for (const t of titleHits) out.push({ kind: "title", path: t.path, title: t.title });
    }
    if (scope === "all" || scope === "folder") {
      for (const f of folderHits) out.push({ kind: "folder", path: f });
    }
    if (scope === "all" || scope === "tag") {
      for (const t of tagHits) out.push({ kind: "tag", tag: t.tag, notePaths: t.notePaths });
    }
    if (scope === "all" || scope === "body") {
      // De-dupe: skip body hits that are already in titleHits when scope=all
      const titlePaths = new Set(titleHits.map((t) => t.path));
      for (const b of bodyHits) {
        if (scope === "all" && titlePaths.has(b.path)) continue;
        out.push({ kind: "body", path: b.path, title: b.title, snippet: b.snippet });
      }
    }
    return out;
  }, [scope, titleHits, folderHits, tagHits, bodyHits]);

  useEffect(() => { setHighlighted(0); }, [rows.length]);

  const openRow = useCallback((r: ResultRow) => {
    if (r.kind === "title" || r.kind === "body") {
      useEditorStore.getState().openTab(r.path);
    } else if (r.kind === "tag") {
      // Open the first note that has this tag.
      const first = r.notePaths[0];
      if (first) useEditorStore.getState().openTab(first);
    } else if (r.kind === "folder") {
      // Open the first note inside; else fall back to a reveal event.
      const prefix = `${r.path}/`;
      const first = snapshot?.notes.find((n) => n.path.startsWith(prefix));
      if (first) useEditorStore.getState().openTab(first.path);
      else window.dispatchEvent(new CustomEvent("sgnk:reveal-in-tree", { detail: { path: r.path } }));
    }
    onClose();
  }, [onClose]);

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted((i) => Math.min(i + 1, rows.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { const r = rows[highlighted]; if (r) openRow(r); }
  }

  if (!open) return null;

  const showEmpty = !bodyLoading && !error && rows.length === 0;

  return (
    <div role="presentation" style={overlayStyle} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search vault"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search titles, body, tags, folders…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
        />
        <div style={chipBar}>
          {(["all", "title", "body", "tag", "folder"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              style={{ ...chipStyle, ...(scope === s ? chipActive : {}) }}
            >
              {s === "all" ? "All" : s === "title" ? "Titles" : s === "body" ? "Body" : s === "tag" ? "Tags" : "Folders"}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>
            {bodyLoading ? "Searching…" : `${rows.length} result${rows.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {error && <div style={statusStyle}>{error}</div>}
        {showEmpty && <div style={statusStyle}>{debouncedQuery ? "No matches" : "Start typing to search…"}</div>}

        {rows.length > 0 && (
          <ul role="list" style={{ listStyle: "none", margin: 0, padding: "4px 0", maxHeight: 420, overflowY: "auto" }}>
            {rows.map((r, i) => (
              <li
                key={`${r.kind}:${r.kind === "tag" ? r.tag : r.path}:${i}`}
                onClick={() => openRow(r)}
                onMouseEnter={() => setHighlighted(i)}
                style={{
                  padding: "10px 16px", cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: 3,
                  background: i === highlighted ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={badgeStyle(r.kind)}>{r.kind}</span>
                  <span style={{ color: "var(--fg)", fontSize: 14, fontWeight: 500 }}>
                    {r.kind === "tag" ? `#${r.tag}` : r.kind === "folder" ? r.path : r.title}
                  </span>
                </div>
                {(r.kind === "title" || r.kind === "body") && (
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>{r.path}</span>
                )}
                {r.kind === "body" && r.snippet && (
                  <span style={{ color: "var(--muted)", fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>{r.snippet}</span>
                )}
                {r.kind === "tag" && (
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>{r.notePaths.length} note{r.notePaths.length === 1 ? "" : "s"}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh", background: "rgba(0,0,0,0.45)" };
const modalStyle: React.CSSProperties = { background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", width: "min(680px, 92vw)", overflow: "hidden" };
const inputStyle: React.CSSProperties = { display: "block", width: "100%", padding: "14px 16px", fontSize: 15, background: "transparent", color: "var(--fg)", border: "none", borderBottom: "1px solid var(--border)", outline: "none" };
const chipBar: React.CSSProperties = { display: "flex", gap: 6, alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--border)" };
const chipStyle: React.CSSProperties = { padding: "4px 10px", fontSize: 12, borderRadius: 999, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", cursor: "pointer" };
const chipActive: React.CSSProperties = { background: "var(--fg)", color: "var(--bg)", borderColor: "var(--fg)" };
const statusStyle: React.CSSProperties = { padding: "16px", textAlign: "center", color: "var(--muted)", fontSize: 14 };
function badgeStyle(kind: ResultRow["kind"]): React.CSSProperties {
  const colors: Record<ResultRow["kind"], string> = { title: "#3b82f6", body: "#10b981", tag: "#a855f7", folder: "#f59e0b" };
  return {
    fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
    padding: "1px 6px", borderRadius: 4,
    color: colors[kind],
    background: `color-mix(in srgb, ${colors[kind]} 15%, transparent)`,
  };
}
