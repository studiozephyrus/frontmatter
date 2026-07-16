"use client";

import { useEffect, useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

/**
 * ThemeToggle — flips the <html> class between `light` and `dark` and persists
 * the choice to localStorage ("sgnk-theme"). Initial theme (match-system or a
 * saved override) is applied pre-paint by /theme-init.js, so this only needs to
 * sync its icon to the current document state on mount.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    root.classList.toggle("light", !next);
    try {
      localStorage.setItem("sgnk-theme", next ? "dark" : "light");
    } catch {
      /* ignore storage errors */
    }
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="sgnk-icon-btn"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {/* Sun / moon Material Symbols Rounded — matches the icon set
          used throughout the toolbar; weight 500 sits between regular
          and semibold for the dense header chrome. */}
      <GoogleIcon name={isDark ? "light_mode" : "dark_mode"} size={18} weight={500} />
    </button>
  );
}
