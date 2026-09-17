import type { CSSProperties } from "react";
import { MATERIAL_SYMBOL_ALIASES, MATERIAL_SYMBOL_PATHS } from "./material-symbol-paths";

/**
 * GoogleIcon — Material Symbols Rounded, delivered as inline SVG.
 *
 * The name is a Google icon identifier ("share", "dock_to_right", "download").
 * The path data lives in `material-symbol-paths.ts`, generated from the
 * official @material-symbols/svg-400 package, so the glyph renders with no
 * network, no web font and no ligature fallback: the web-font delivery that
 * this component used before showed the literal name ("check_circle") the
 * moment the font failed to load, which the repository's icon rule bans.
 *
 * Props keep the shape of the earlier component so callers do not change:
 *   fill   – outlined (default) or the filled variant where one exists
 *   weight – accepted for compatibility; the paths are weight 400
 *   size   – rendered px box
 * The glyph inherits `color` through `fill="currentColor"`.
 */
interface GoogleIconProps {
  name: string;
  size?: number;
  fill?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
  className?: string;
  title?: string;
  style?: CSSProperties;
}

function pathFor(name: string, fill: boolean): string | undefined {
  const base = MATERIAL_SYMBOL_ALIASES[name] ?? name;
  if (fill) {
    const filled = MATERIAL_SYMBOL_PATHS[`${base}-fill`];
    if (filled !== undefined) return filled;
  }
  return MATERIAL_SYMBOL_PATHS[base];
}

export function GoogleIcon({
  name,
  size = 18,
  fill = false,
  className,
  title,
  style,
}: GoogleIconProps): React.JSX.Element {
  const d = pathFor(name, fill);
  const composed: CSSProperties = {
    width: size,
    height: size,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    ...style,
  };
  if (d === undefined) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`GoogleIcon: no path for "${name}"; add it to material-symbol-paths.ts`);
    }
    return <span aria-hidden="true" className={className} style={composed} />;
  }
  return (
    <span
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
      role={title ? "img" : undefined}
      className={className}
      style={composed}
    >
      <svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" focusable="false">
        <path d={d} />
      </svg>
    </span>
  );
}
