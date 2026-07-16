"use client";

import { useMemo } from "react";
import { useSnapshot } from "@/modules/vault";
import { useEditorStore } from "@/modules/editor";

export function Backlinks() {
  // Stable scalar selector — never returns a new object
  const activePath = useEditorStore((s) => s.activePath);

  const snapshotState = useSnapshot();

  // Derive the backlinks list — memoized to avoid a new array every render
  const backlinks = useMemo<{ path: string; title: string }[]>(() => {
    if (!activePath || !snapshotState.snapshot) return [];
    const meta = snapshotState.snapshot.notes.find((n) => n.path === activePath);
    if (!meta) return [];
    return meta.backlinks.map((blPath) => {
      const blMeta = snapshotState.snapshot!.notes.find((n) => n.path === blPath);
      const title = blMeta?.title ?? blPath.split("/").pop()?.replace(/\.md$/, "") ?? blPath;
      return { path: blPath, title };
    });
  }, [activePath, snapshotState.snapshot]);

  if (!activePath) {
    return (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Open a note to see backlinks
      </p>
    );
  }

  if (snapshotState.loading) {
    return (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Loading…
      </p>
    );
  }

  if (snapshotState.error) {
    return (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Error: {snapshotState.error}
      </p>
    );
  }

  if (backlinks.length === 0) {
    return (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        No backlinks
      </p>
    );
  }

  return (
    <ul className="space-y-0.5">
      {backlinks.map(({ path, title }) => (
        <li key={path}>
          <button
            className="w-full truncate rounded px-1 py-0.5 text-left text-xs hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--link)" }}
            onClick={() => {
              useEditorStore.getState().openTab(path);
            }}
          >
            {title}
          </button>
        </li>
      ))}
    </ul>
  );
}
