"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSnapshot } from "@/modules/vault";
import { useEditorStore } from "@/modules/editor";
import { fuzzyFilter } from "./fuzzy";
import type { NoteMeta, TreeNode } from "@/modules/vault";

type SpotlightItem =
  | { kind: "note"; path: string; title: string }
  | { kind: "folder"; path: string };

function collectFolders(node: TreeNode, out: string[] = []): string[] {
  if (!node.children) return out;
  for (const c of node.children) {
    if (c.type === "folder") { if (c.path) out.push(c.path); collectFolders(c, out); }
  }
  return out;
}

interface SpotlightProps {
  open: boolean;
  onClose: () => void;
}

const MAX_RESULTS = 20;

export function Spotlight({ open, onClose }: SpotlightProps): React.ReactNode {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const snapshotState = useSnapshot();
  const notes: NoteMeta[] =
    snapshotState.loading || snapshotState.error || !snapshotState.snapshot
      ? []
      : snapshotState.snapshot.notes;
  const folders: string[] = useMemo(() =>
    snapshotState.loading || snapshotState.error || !snapshotState.snapshot
      ? []
      : collectFolders(snapshotState.snapshot.tree),
    [snapshotState],
  );

  const results: SpotlightItem[] = useMemo(() => {
    const noteHits = fuzzyFilter(notes, query, (n) => n.title)
      .slice(0, MAX_RESULTS)
      .map<SpotlightItem>((n) => ({ kind: "note", path: n.path, title: n.title }));
    if (!query.trim()) return noteHits;
    const folderHits = folders
      .filter((f) => f.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8)
      .map<SpotlightItem>((p) => ({ kind: "folder", path: p }));
    return [...noteHits, ...folderHits].slice(0, MAX_RESULTS + 8);
  }, [notes, folders, query]);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlightedIndex(0);
      // Defer focus so the dialog is in DOM
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  // Clamp highlighted index when results shrink
  useEffect(() => {
    if (highlightedIndex >= results.length) {
      setHighlightedIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, highlightedIndex]);

  const openSelected = useCallback(() => {
    const selected = results[highlightedIndex];
    if (!selected) return;
    if (selected.kind === "note") {
      useEditorStore.getState().openTab(selected.path);
    } else {
      // Folder selected — open the first note inside, else dispatch reveal event.
      const prefix = `${selected.path}/`;
      const firstNote = notes.find((n) => n.path.startsWith(prefix));
      if (firstNote) useEditorStore.getState().openTab(firstNote.path);
      else window.dispatchEvent(new CustomEvent("sgnk:reveal-in-tree", { detail: { path: selected.path } }));
    }
    onClose();
  }, [results, highlightedIndex, onClose]);

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      openSelected();
      return;
    }
  }

  if (!open) return null;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
        background: "rgba(0,0,0,0.45)",
      }}
      onClick={onClose}
    >
      {/* Dialog — stop propagation so click inside doesn't close */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick switcher"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          width: "min(600px, 90vw)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search notes…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(0);
          }}
          style={{
            display: "block",
            width: "100%",
            padding: "14px 16px",
            fontSize: 15,
            background: "transparent",
            color: "var(--fg)",
            border: "none",
            borderBottom: "1px solid var(--border)",
            outline: "none",
          }}
        />

        {results.length > 0 ? (
          <ul
            role="listbox"
            style={{
              listStyle: "none",
              margin: 0,
              padding: "4px 0",
              maxHeight: 360,
              overflowY: "auto",
            }}
          >
            {results.map((item, idx) => (
              <li
                key={`${item.kind}:${item.path}`}
                role="option"
                aria-selected={idx === highlightedIndex}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  background:
                    idx === highlightedIndex
                      ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                      : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
                onClick={() => {
                  if (item.kind === "note") {
                    useEditorStore.getState().openTab(item.path);
                  } else {
                    window.dispatchEvent(new CustomEvent("sgnk:reveal-in-tree", { detail: { path: item.path } }));
                  }
                  onClose();
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
                    padding: "1px 6px", borderRadius: 4,
                    color: item.kind === "folder" ? "#f59e0b" : "#3b82f6",
                    background: item.kind === "folder"
                      ? "color-mix(in srgb, #f59e0b 15%, transparent)"
                      : "color-mix(in srgb, #3b82f6 15%, transparent)",
                  }}>{item.kind}</span>
                  <span style={{ color: "var(--fg)", fontSize: 14, fontWeight: 500 }}>
                    {item.kind === "note" ? item.title : item.path}
                  </span>
                </span>
                {item.kind === "note" && (
                  <span style={{ color: "var(--muted)", fontSize: 12 }}>
                    {item.path}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            {query ? "No matching notes" : "Start typing to search…"}
          </div>
        )}
      </div>
    </div>
  );
}
