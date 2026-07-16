"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

export type Tab = {
  path: string;
  title: string;
  dirty: boolean;
};

/**
 * Editor view modes:
 *   edit    — raw markdown source, single pane.
 *   live    — preview-first: the note renders as markdown; clicking a block
 *             opens THAT block's source inline for editing (Esc/blur
 *             re-renders). Single pane, no separate preview.
 *   reading — rendered preview only (read-only render).
 *   split   — source + rendered preview side by side.
 */
export type EditorMode = "edit" | "live" | "reading" | "split";

type EditorState = {
  tabs: Tab[];
  activePath: string | null;
  /** Second editor pane (true side-by-side). null = single pane. */
  secondaryPath: string | null;
  mode: EditorMode;
  contentByPath: Record<string, string>;
  /** Last-known committed blob sha per path — used as OCC baseSha when an
   *  out-of-editor mutation (AI apply, history restore) writes a draft, so it
   *  is never written with the "" create-sentinel (which would 409 on commit). */
  baseShaByPath: Record<string, string>;
  /** Per-path remount counter — bump to force the editor to reload a note's
   *  content from the server (e.g. after restoring an old version). */
  reloadByPath: Record<string, number>;
};

type EditorActions = {
  openTab: (path: string) => void;
  closeTab: (path: string) => void;
  setActive: (path: string) => void;
  setDirty: (path: string, dirty: boolean) => void;
  setMode: (mode: EditorMode) => void;
  openSecondary: (path: string) => void;
  closeSecondary: () => void;
  setContent: (path: string, content: string) => void;
  setBaseSha: (path: string, sha: string) => void;
  bumpReload: (path: string) => void;
  /** Remap an open note from oldPath→newPath after a rename/move so its tab,
   *  active/secondary selection, cached content and base sha follow it (instead
   *  of being stranded on the deleted old path). Draft migration is done by the
   *  caller (async IDB) — see migrateDraft. */
  renamePath: (oldPath: string, newPath: string) => void;
  /** Reconcile dirty flags against the real draft index (call client-side after mount). */
  reconcileDirtyFlags: () => void;
};

function deriveTitle(path: string): string {
  const base = path.split("/").pop() ?? path;
  return base.endsWith(".md") ? base.slice(0, -3) : base;
}

/**
 * No-op StateStorage for SSR: getItem always returns null, setItem/removeItem
 * are silent. This satisfies the StateStorage interface without touching any
 * browser API that doesn't exist on the server.
 */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

/**
 * SSR-safe sessionStorage factory.
 * Returns real sessionStorage in the browser; falls back to noopStorage on the
 * server so Zustand persist never throws during SSR/static rendering.
 */
function sessionStorageOrNoop(): StateStorage {
  return typeof window !== "undefined" ? sessionStorage : noopStorage;
}

export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    (set) => ({
      tabs: [],
      activePath: null,
      secondaryPath: null,
      mode: "reading",
      contentByPath: {},
      baseShaByPath: {},
      reloadByPath: {},

      openTab(path) {
        set((state) => {
          const exists = state.tabs.some((t) => t.path === path);
          if (exists) {
            return { activePath: path };
          }
          const newTab: Tab = { path, title: deriveTitle(path), dirty: false };
          return { tabs: [...state.tabs, newTab], activePath: path };
        });
      },

      closeTab(path) {
        set((state) => {
          const idx = state.tabs.findIndex((t) => t.path === path);
          if (idx === -1) return {};

          const newTabs = state.tabs.filter((t) => t.path !== path);
          // If the secondary pane held this note, close that pane.
          const secondaryPatch = state.secondaryPath === path ? { secondaryPath: null } : {};

          if (state.activePath !== path) {
            // Closing a non-active tab — activePath unchanged
            return { tabs: newTabs, ...secondaryPatch };
          }

          // Closing the active tab — pick a neighbour
          let nextActive: string | null = null;
          if (newTabs.length > 0) {
            // Prefer left (idx - 1), fall back to right (idx, which is now the next element)
            const leftIdx = idx - 1;
            const neighbour = newTabs[leftIdx >= 0 ? leftIdx : 0];
            nextActive = neighbour?.path ?? null;
          }

          // If the neighbour we activate is the split's note, collapse the split.
          const collapse = nextActive !== null && nextActive === state.secondaryPath ? { secondaryPath: null } : {};
          return { tabs: newTabs, activePath: nextActive, ...secondaryPatch, ...collapse };
        });
      },

      setActive(path) {
        // If the user activates the note shown in the split pane, collapse the
        // split (the two panes can't hold the same note) instead of leaving a
        // dangling secondaryPath === activePath that strands the ⇆ toggle.
        set((state) => (path === state.secondaryPath ? { activePath: path, secondaryPath: null } : { activePath: path }));
      },

      setDirty(path, dirty) {
        set((state) => ({
          tabs: state.tabs.map((t) => (t.path === path ? { ...t, dirty } : t)),
        }));
      },

      setMode(mode) {
        set({ mode });
      },

      openSecondary(path) {
        // Refuse to open the same note in both panes — the two panes hold
        // independent EditorStates that both autosave to the same draft key,
        // which would clobber each other (last-writer-wins).
        set((state) => (path === state.activePath ? {} : { secondaryPath: path }));
      },

      closeSecondary() {
        set({ secondaryPath: null });
      },

      setContent(path, content) {
        set((state) => ({
          contentByPath: { ...state.contentByPath, [path]: content },
        }));
      },

      setBaseSha(path, sha) {
        set((state) => ({
          baseShaByPath: { ...state.baseShaByPath, [path]: sha },
        }));
      },

      bumpReload(path) {
        set((state) => ({
          reloadByPath: { ...state.reloadByPath, [path]: (state.reloadByPath[path] ?? 0) + 1 },
        }));
      },

      renamePath(oldPath, newPath) {
        if (oldPath === newPath) return;
        set((state) => {
          const moveKey = <T>(rec: Record<string, T>): Record<string, T> => {
            if (!(oldPath in rec)) return rec;
            const next = { ...rec };
            next[newPath] = next[oldPath] as T;
            delete next[oldPath];
            return next;
          };
          return {
            tabs: state.tabs.map((t) =>
              t.path === oldPath ? { ...t, path: newPath, title: deriveTitle(newPath) } : t,
            ),
            activePath: state.activePath === oldPath ? newPath : state.activePath,
            secondaryPath: state.secondaryPath === oldPath ? newPath : state.secondaryPath,
            contentByPath: moveKey(state.contentByPath),
            baseShaByPath: moveKey(state.baseShaByPath),
          };
        });
      },

      reconcileDirtyFlags() {
        // Lazily import to keep this SSR-safe (listDirtyPaths reads localStorage).
        // Called from a client useEffect so it always runs in the browser.
        import("@/modules/drafts")
          .then(({ listDirtyPaths }) => {
            const dirtySet = new Set(listDirtyPaths());
            set((state) => ({
              tabs: state.tabs.map((t) => ({
                ...t,
                dirty: dirtySet.has(t.path),
              })),
            }));
          })
          .catch(() => {
            // If the import fails we silently clear all dirty flags rather than
            // leaving potentially stale dots.
            set((state) => ({
              tabs: state.tabs.map((t) => ({ ...t, dirty: false })),
            }));
          });
      },
    }),
    {
      name: "sgnk-md-editor",
      storage: createJSONStorage(sessionStorageOrNoop),
      /**
       * Only persist the structural state.
       * `contentByPath` is large, stale across commits, and is re-seeded from
       * the vault API when a note loads — never persist it.
       */
      partialize: (s) => ({
        tabs: s.tabs,
        activePath: s.activePath,
        secondaryPath: s.secondaryPath,
        mode: s.mode,
      }),
    },
  ),
);
