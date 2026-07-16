/**
 * editor-store.test.ts — unit tests for the editor tab state store.
 * Uses Zustand vanilla store (no React) via getState() / setState().
 * Node environment is sufficient (no DOM needed).
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "@/modules/editor/presentation/editor-store";

// ---------------------------------------------------------------------------
// Persist middleware — partialize contract
// ---------------------------------------------------------------------------

describe("persist partialize", () => {
  it("persisted shape includes tabs, activePath, and mode but NOT contentByPath", () => {
    // Access the persist options via the Zustand persist API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const persistApi = (useEditorStore as any).persist as {
      getOptions: () => { partialize?: (s: unknown) => unknown };
    };
    const partialize = persistApi?.getOptions?.()?.partialize;
    expect(partialize).toBeDefined();

    // Simulate state with contentByPath populated
    const fakeState = {
      tabs: [{ path: "A.md", title: "A", dirty: false }],
      activePath: "A.md",
      mode: "reading",
      contentByPath: { "A.md": "# content" },
    };

    const persisted = (partialize as (s: typeof fakeState) => unknown)(fakeState);

    expect(persisted).toEqual({
      tabs: fakeState.tabs,
      activePath: fakeState.activePath,
      mode: fakeState.mode,
    });

    // Explicitly assert contentByPath is absent
    expect(persisted).not.toHaveProperty("contentByPath");
  });
});

beforeEach(() => {
  // Reset store to initial state before each test
  useEditorStore.setState({
    tabs: [],
    activePath: null,
    mode: "reading",
    contentByPath: {},
  });
});

describe("initial state", () => {
  it("has empty tabs and null activePath", () => {
    const { tabs, activePath } = useEditorStore.getState();
    expect(tabs).toEqual([]);
    expect(activePath).toBeNull();
  });

  it("has mode 'reading' by default", () => {
    expect(useEditorStore.getState().mode).toBe("reading");
  });

  it("has empty contentByPath by default", () => {
    expect(useEditorStore.getState().contentByPath).toEqual({});
  });
});

describe("openTab", () => {
  it("adds a tab with derived title and sets activePath", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");

    const { tabs, activePath } = useEditorStore.getState();
    expect(tabs).toHaveLength(1);
    expect(tabs[0]).toEqual({ path: "Projects/HQ/HQ.md", title: "HQ", dirty: false });
    expect(activePath).toBe("Projects/HQ/HQ.md");
  });

  it("does NOT duplicate a tab when the same path is opened twice", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");

    const { tabs, activePath } = useEditorStore.getState();
    expect(tabs).toHaveLength(1);
    expect(activePath).toBe("Projects/HQ/HQ.md");
  });

  it("just sets the already-open tab active (no duplicate)", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().openTab("Research/Paper.md");
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");

    const { tabs, activePath } = useEditorStore.getState();
    expect(tabs).toHaveLength(2);
    expect(activePath).toBe("Projects/HQ/HQ.md");
  });

  it("adds a second tab and makes IT the active path", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().openTab("Research/Paper.md");

    const { tabs, activePath } = useEditorStore.getState();
    expect(tabs).toHaveLength(2);
    expect(tabs[1]).toEqual({ path: "Research/Paper.md", title: "Paper", dirty: false });
    expect(activePath).toBe("Research/Paper.md");
  });
});

describe("setActive", () => {
  it("changes activePath to the given path", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().openTab("Research/Paper.md");
    useEditorStore.getState().setActive("Projects/HQ/HQ.md");

    expect(useEditorStore.getState().activePath).toBe("Projects/HQ/HQ.md");
  });
});

describe("setDirty", () => {
  it("marks a tab dirty", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().setDirty("Projects/HQ/HQ.md", true);

    const tab = useEditorStore.getState().tabs[0]!;
    expect(tab.dirty).toBe(true);
  });

  it("clears dirty flag", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().setDirty("Projects/HQ/HQ.md", true);
    useEditorStore.getState().setDirty("Projects/HQ/HQ.md", false);

    const tab = useEditorStore.getState().tabs[0]!;
    expect(tab.dirty).toBe(false);
  });
});

describe("closeTab", () => {
  it("removes the tab", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().closeTab("Projects/HQ/HQ.md");

    expect(useEditorStore.getState().tabs).toHaveLength(0);
  });

  it("sets activePath to null when the last tab is closed", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().closeTab("Projects/HQ/HQ.md");

    expect(useEditorStore.getState().activePath).toBeNull();
  });

  it("closing non-active tab leaves activePath unchanged", () => {
    useEditorStore.getState().openTab("Projects/HQ/HQ.md");
    useEditorStore.getState().openTab("Research/Paper.md");
    // activePath is now Paper.md
    useEditorStore.getState().closeTab("Projects/HQ/HQ.md");

    const { tabs, activePath } = useEditorStore.getState();
    expect(tabs).toHaveLength(1);
    expect(activePath).toBe("Research/Paper.md");
  });

  it("closing the active tab prefers the left neighbour", () => {
    useEditorStore.getState().openTab("A/A.md");
    useEditorStore.getState().openTab("B/B.md");
    useEditorStore.getState().openTab("C/C.md");
    // tabs: [A, B, C], active: C
    useEditorStore.getState().closeTab("C/C.md");

    expect(useEditorStore.getState().activePath).toBe("B/B.md");
  });

  it("falls back to the right neighbour when no left exists", () => {
    useEditorStore.getState().openTab("A/A.md");
    useEditorStore.getState().openTab("B/B.md");
    useEditorStore.getState().setActive("A/A.md");
    // tabs: [A, B], active: A — closing A should activate B (right)
    useEditorStore.getState().closeTab("A/A.md");

    expect(useEditorStore.getState().activePath).toBe("B/B.md");
  });
});

describe("setMode", () => {
  it("changes mode to 'edit'", () => {
    useEditorStore.getState().setMode("edit");
    expect(useEditorStore.getState().mode).toBe("edit");
  });

  it("changes mode to 'split'", () => {
    useEditorStore.getState().setMode("split");
    expect(useEditorStore.getState().mode).toBe("split");
  });

  it("changes mode back to 'reading'", () => {
    useEditorStore.getState().setMode("edit");
    useEditorStore.getState().setMode("reading");
    expect(useEditorStore.getState().mode).toBe("reading");
  });

  it("supports the 'live' mode", () => {
    useEditorStore.getState().setMode("live");
    expect(useEditorStore.getState().mode).toBe("live");
  });

  it("round-trips all four modes", () => {
    for (const m of ["edit", "live", "reading", "split"] as const) {
      useEditorStore.getState().setMode(m);
      expect(useEditorStore.getState().mode).toBe(m);
    }
  });
});

describe("setContent", () => {
  it("stores content for a path", () => {
    useEditorStore.getState().setContent("Projects/HQ/HQ.md", "# HQ content");
    expect(useEditorStore.getState().contentByPath["Projects/HQ/HQ.md"]).toBe("# HQ content");
  });

  it("updates content for the same path", () => {
    useEditorStore.getState().setContent("Projects/HQ/HQ.md", "first");
    useEditorStore.getState().setContent("Projects/HQ/HQ.md", "second");
    expect(useEditorStore.getState().contentByPath["Projects/HQ/HQ.md"]).toBe("second");
  });

  it("stores content for multiple paths independently", () => {
    useEditorStore.getState().setContent("A/A.md", "content-a");
    useEditorStore.getState().setContent("B/B.md", "content-b");
    expect(useEditorStore.getState().contentByPath["A/A.md"]).toBe("content-a");
    expect(useEditorStore.getState().contentByPath["B/B.md"]).toBe("content-b");
  });
});
