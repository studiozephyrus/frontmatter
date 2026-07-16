"use client";

/**
 * Editor view settings — persisted to localStorage, toggled from the editor
 * statusbar / command palette. Read by CodeMirrorEditor (reconfigures live via
 * Compartments) and EditorPane (focus mode chrome).
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

type EditorSettings = {
  vimMode: boolean;
  lineNumbers: boolean;
  spellcheck: boolean;
  focusMode: boolean;
  aiGhostText: boolean;
};

type EditorSettingsActions = {
  toggle: (key: keyof EditorSettings) => void;
  set: (key: keyof EditorSettings, value: boolean) => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function localStorageOrNoop(): StateStorage {
  return typeof window !== "undefined" ? window.localStorage : noopStorage;
}

export const useEditorSettings = create<EditorSettings & EditorSettingsActions>()(
  persist(
    (set) => ({
      vimMode: false,
      lineNumbers: false,
      spellcheck: true,
      focusMode: false,
      aiGhostText: false,
      toggle: (key) => set((s) => ({ [key]: !s[key] }) as Partial<EditorSettings>),
      set: (key, value) => set({ [key]: value } as Partial<EditorSettings>),
    }),
    {
      name: "sgnk-md-editor-settings",
      storage: createJSONStorage(localStorageOrNoop),
    },
  ),
);
