import { describe, it, expect } from "vitest";
import {
  shouldSyncScroll,
  createSplitScrollSync,
  SYNC_INTENT_WINDOW_MS,
} from "@/modules/editor/presentation/split-scroll-sync";

describe("shouldSyncScroll", () => {
  it("ignores a scroll event when there is no recent user gesture (reflow scroll)", () => {
    expect(shouldSyncScroll("right", null, 1000)).toBe(false);
  });

  it("syncs when the user gesture is on the same pane and recent", () => {
    expect(shouldSyncScroll("left", { side: "left", at: 1000 }, 1100)).toBe(true);
  });

  it("does NOT sync the opposite pane while the user drives the other (the yank bug)", () => {
    // User is typing in the LEFT editor; the preview re-render fires a RIGHT
    // scroll event. Before the fix this yanked the editor to the preview's
    // (near-top) fraction. It must now be ignored.
    expect(shouldSyncScroll("right", { side: "left", at: 1000 }, 1010)).toBe(false);
  });

  it("ignores a stale gesture beyond the intent window", () => {
    expect(
      shouldSyncScroll("left", { side: "left", at: 1000 }, 1000 + SYNC_INTENT_WINDOW_MS + 1),
    ).toBe(false);
  });

  it("syncs exactly at the window boundary", () => {
    expect(
      shouldSyncScroll("left", { side: "left", at: 1000 }, 1000 + SYNC_INTENT_WINDOW_MS),
    ).toBe(true);
  });
});

describe("createSplitScrollSync", () => {
  it("blocks reflow echo: gesture on left, a scroll on right is ignored", () => {
    const s = createSplitScrollSync();
    s.noteGesture("left", 1000);
    expect(s.shouldSync("left", 1005)).toBe(true); // editor scroll → preview follows
    expect(s.shouldSync("right", 1005)).toBe(false); // preview reflow → editor stays put
  });

  it("lets the preview drive when the user actually scrolls the preview", () => {
    const s = createSplitScrollSync();
    s.noteGesture("right", 2000);
    expect(s.shouldSync("right", 2010)).toBe(true);
    expect(s.shouldSync("left", 2010)).toBe(false);
  });

  it("switches driver on a new gesture", () => {
    const s = createSplitScrollSync();
    s.noteGesture("left", 1000);
    expect(s.shouldSync("left", 1010)).toBe(true);
    s.noteGesture("right", 1020);
    expect(s.shouldSync("left", 1025)).toBe(false);
    expect(s.shouldSync("right", 1025)).toBe(true);
  });
});
