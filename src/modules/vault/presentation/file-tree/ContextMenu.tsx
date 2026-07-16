import { useEffect, useRef } from "react";
import type { MenuEntry } from "./types";

/** Floating menu used both for the row context menu (right-click) and the
 *  "..." dropdown on tree rows. `anchor` controls placement: a fixed point
 *  for right-click; `"below"` for dropdowns anchored to the parent element. */
export function ContextMenu({
  items,
  anchor,
  onClose,
}: {
  items: MenuEntry[];
  anchor: { x: number; y: number } | "below";
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  const style: React.CSSProperties =
    anchor === "below"
      ? { position: "absolute", right: 0, top: "100%" }
      : { position: "fixed", left: anchor.x, top: anchor.y };

  return (
    <div
      ref={ref}
      role="menu"
      style={{
        ...style,
        zIndex: 1500,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        minWidth: 160,
      }}
    >
      {items.map((it) => (
        <button
          key={it.label}
          role="menuitem"
          onClick={(e) => { e.stopPropagation(); onClose(); it.onClick(); }}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "6px 12px",
            fontSize: 12,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: it.variant === "danger" ? "#dc2626" : "var(--fg)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--panel)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
