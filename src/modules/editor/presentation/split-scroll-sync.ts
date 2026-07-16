/**
 * Split-scroll sync intent model.
 *
 * In split mode the editor (`.cm-scroller`) and preview (`[data-scroll-region]`)
 * mirror each other's fractional scroll position. The naive implementation
 * cross-applied EVERY scroll event, so when the preview re-rendered on a
 * keystroke its reflow-induced scroll event yanked the editor to the preview's
 * (near-top) fraction — the "scroll jumps to top while typing" bug.
 *
 * Fix: scroll-sync is **user-intent driven**. Only the pane the user is
 * actively driving — via a wheel / pointer / keydown gesture within a short
 * window — propagates its scroll to the other pane. A scroll event produced by
 * a re-render (no preceding user gesture on that pane) is ignored, so reflow
 * can never move the opposite pane. This also removes the need for an explicit
 * echo guard: a programmatic `scrollTop` write lands on the NON-driver pane, so
 * its echo scroll event fails the intent check and stops there.
 */

export type ScrollSide = "left" | "right";

/** How long after a user gesture a pane stays the scroll-sync "driver". */
export const SYNC_INTENT_WINDOW_MS = 250;

export type UserScrollIntent = { side: ScrollSide; at: number } | null;

/**
 * Pure decision: should a scroll event on `eventSide` propagate to the other
 * pane? Only when the user's most recent gesture was on that same side and is
 * still within `windowMs`. No gesture, an opposite-side gesture, or a stale
 * gesture all mean "do not sync".
 */
export function shouldSyncScroll(
  eventSide: ScrollSide,
  intent: UserScrollIntent,
  now: number,
  windowMs: number = SYNC_INTENT_WINDOW_MS,
): boolean {
  if (intent === null) return false;
  if (intent.side !== eventSide) return false;
  return now - intent.at <= windowMs;
}

export type SplitScrollSync = {
  /** Record a genuine user gesture (wheel / pointerdown / keydown) on a pane. */
  noteGesture: (side: ScrollSide, now?: number) => void;
  /** Decide whether a scroll event on `side` should sync to the other pane. */
  shouldSync: (side: ScrollSide, now?: number) => boolean;
};

/** Stateful controller wrapping {@link shouldSyncScroll}. */
export function createSplitScrollSync(windowMs: number = SYNC_INTENT_WINDOW_MS): SplitScrollSync {
  let intent: UserScrollIntent = null;
  return {
    noteGesture(side, now = Date.now()) {
      intent = { side, at: now };
    },
    shouldSync(side, now = Date.now()) {
      return shouldSyncScroll(side, intent, now, windowMs);
    },
  };
}
