"use client";

import { useEffect } from "react";

type Combo = "mod+k" | "mod+p" | "mod+g";

/**
 * Registers a keydown listener on `window` for a Cmd/Ctrl+key combo.
 * `mod` = metaKey (Mac) or ctrlKey (other).
 * Calls handler and prevents default on match; cleans up on unmount.
 */
export function useHotkey(combo: Combo, handler: () => void): void {
  useEffect(() => {
    const key = combo.split("+").pop() ?? "";

    function onKeyDown(e: KeyboardEvent): void {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) {
        e.preventDefault();
        handler();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [combo, handler]);
}
