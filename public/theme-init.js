(function () {
  // Theme — saved override OR match-system. Pre-paint so the first
  // frame matches the user's stored preference (no FOUC).
  try {
    var t = localStorage.getItem("sgnk-theme");
    var dark = t
      ? t === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.add(dark ? "dark" : "light");
  } catch (e) {
    document.documentElement.classList.add("light");
  }

  // Right-pane cycle — single 3-state mode persisted under
  // `sgnk-right-pane-mode`:
  //   "hidden"   default; backlinks closed + scroll indicator hidden
  //   "sidebar"  backlinks open
  //   "scroll"   scroll indicator visible
  //
  // We resolve the mode here so the pre-paint frame already shows the
  // right state of the indicator (the workspace component owns the
  // backlinks pane's React state). Mirror the resolved mode into the
  // two legacy keys that other components still read on mount.
  try {
    var m = localStorage.getItem("sgnk-right-pane-mode");
    if (m !== "sidebar" && m !== "scroll") m = "hidden";

    // Scroll indicator class (consumed by globals.css).
    if (m !== "scroll") {
      document.documentElement.classList.add("scrollind-hidden");
    }

    // Mirror to the legacy keys.
    localStorage.setItem(
      "sgnk-scrollind",
      m === "scroll" ? "shown" : "hidden",
    );
    localStorage.setItem(
      "sgnk-right-pane",
      m === "sidebar" ? "open" : "closed",
    );
  } catch (e) {
    document.documentElement.classList.add("scrollind-hidden");
  }
})();
