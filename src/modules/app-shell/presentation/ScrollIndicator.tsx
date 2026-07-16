"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrollIndicator — interactive reading-position scrubber shown on the right
 * edge when the right pane is collapsed.
 *
 * - Reflects the active scroller's position (live %).
 * - Drag anywhere on the track to scrub through the document.
 * - Click a position to jump there.
 * - Wheel over the widget to scroll the content.
 *
 * The active scroller is resolved on demand from <main>: CodeMirror's
 * .cm-scroller (edit/split) or a [data-scroll-region] container (reading/split).
 */

const TICKS = 11;

function findScroller(): HTMLElement | null {
  const main = document.querySelector("main");
  if (!main) return null;
  const els = main.querySelectorAll<HTMLElement>(
    ".cm-scroller, [data-scroll-region]",
  );
  let best: HTMLElement | null = null;
  let bestOverflow = 4;
  for (const el of els) {
    if (el.getClientRects().length === 0) continue; // not visible
    const overflow = el.scrollHeight - el.clientHeight;
    if (overflow > bestOverflow) {
      best = el;
      bestOverflow = overflow;
    }
  }
  return best;
}

export function ScrollIndicator() {
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const draggingRef = useRef(false);

  // Live position tracking (rAF poll covers any scroller without wiring each).
  useEffect(() => {
    let raf = 0;
    function tick() {
      const sc = findScroller();
      if (sc) {
        const max = sc.scrollHeight - sc.clientHeight;
        if (max > 4) {
          setVisible(true);
          if (!draggingRef.current) {
            setPct(Math.min(1, Math.max(0, sc.scrollTop / max)));
          }
        } else {
          setVisible(false);
        }
      } else {
        setVisible(false);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Wheel over the widget scrolls the content (native listener so we can
  // preventDefault — React's onWheel is passive). Re-run when `visible` flips
  // so the listener attaches once the <nav> actually mounts.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    function onWheel(e: WheelEvent) {
      const sc = findScroller();
      if (!sc) return;
      e.preventDefault();
      sc.scrollTop += e.deltaY;
    }
    nav.addEventListener("wheel", onWheel, { passive: false });
    return () => nav.removeEventListener("wheel", onWheel);
  }, [visible]);

  function scrubToClientY(clientY: number) {
    const track = trackRef.current;
    const sc = findScroller();
    if (!track || !sc) return;
    const rect = track.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const max = sc.scrollHeight - sc.clientHeight;
    sc.scrollTop = frac * max;
    setPct(frac);
  }

  function onPointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    scrubToClientY(e.clientY);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    scrubToClientY(e.clientY);
  }
  function endDrag(e: React.PointerEvent) {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  if (!visible) return null;

  const active = Math.round(pct * (TICKS - 1));

  return (
    <nav ref={navRef} className="sgnk-scrollind sgnk-fade-in" aria-label="Reading position">
      <div className="sgnk-scrollind__pct">{Math.round(pct * 100)}%</div>
      <div
        ref={trackRef}
        className="sgnk-scrollind__ticks"
        role="slider"
        aria-label="Scroll position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct * 100)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ cursor: "ns-resize", touchAction: "none" }}
      >
        {Array.from({ length: TICKS }).map((_, i) => (
          <span
            key={i}
            className="sgnk-scrollind__tick"
            data-active={i <= active || undefined}
            data-current={i === active || undefined}
          />
        ))}
      </div>
    </nav>
  );
}
