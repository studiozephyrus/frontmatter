"use client";

/**
 * Bookmarks (starred notes) — persisted to localStorage. Toggled from the
 * editor statusbar; listed in the right pane's Bookmarks section.
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

type BookmarksState = {
  paths: string[];
  toggle: (path: string) => void;
  has: (path: string) => boolean;
};

const noopStorage: StateStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
function ls(): StateStorage {
  return typeof window !== "undefined" ? window.localStorage : noopStorage;
}

export const useBookmarks = create<BookmarksState>()(
  persist(
    (set, get) => ({
      paths: [],
      toggle: (path) =>
        set((s) => ({
          paths: s.paths.includes(path) ? s.paths.filter((p) => p !== path) : [...s.paths, path],
        })),
      has: (path) => get().paths.includes(path),
    }),
    { name: "sgnk-md-bookmarks", storage: createJSONStorage(ls) },
  ),
);
