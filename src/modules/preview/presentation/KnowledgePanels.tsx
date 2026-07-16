"use client";

/**
 * TagsPanel + BookmarksPanel — right-pane knowledge sections.
 *
 * TagsPanel: every tag in the vault with its note count (from snapshot
 * metadata). Clicking a tag presets the search to that tag and opens the
 * search panel (via sessionStorage handoff + the sgnk:open-search event).
 *
 * BookmarksPanel: starred notes (localStorage), click to open.
 */
import { useMemo } from "react";
import { useSnapshot } from "@/modules/vault";
import { useEditorStore, useBookmarks } from "@/modules/editor";

export function TagsPanel(): React.JSX.Element {
  const { snapshot } = useSnapshot();

  const tags = useMemo<{ tag: string; count: number }[]>(() => {
    if (!snapshot) return [];
    const counts = new Map<string, number>();
    for (const note of snapshot.notes) {
      for (const tag of note.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }, [snapshot]);

  if (tags.length === 0) {
    return (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        No tags yet
      </p>
    );
  }

  function openTag(tag: string) {
    try {
      sessionStorage.setItem("sgnk:search-preset", `#${tag}`);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("sgnk:open-search"));
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {tags.map(({ tag, count }) => (
        <button key={tag} className="sgnk-chip" onClick={() => openTag(tag)} style={{ cursor: "pointer" }}>
          #{tag}
          <span style={{ color: "var(--muted)" }}>{count}</span>
        </button>
      ))}
    </div>
  );
}

export function BookmarksPanel(): React.JSX.Element {
  const paths = useBookmarks((s) => s.paths);

  if (paths.length === 0) {
    return (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        No bookmarks — star a note from its statusbar
      </p>
    );
  }

  return (
    <ul className="space-y-0.5">
      {paths.map((path) => {
        const title = path.split("/").pop()?.replace(/\.md$/, "") ?? path;
        return (
          <li key={path}>
            <button
              className="w-full truncate rounded px-1 py-0.5 text-left text-xs hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: "var(--link)" }}
              onClick={() => useEditorStore.getState().openTab(path)}
              title={path}
            >
              ★ {title}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
