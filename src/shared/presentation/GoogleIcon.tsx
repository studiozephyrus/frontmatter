import type { CSSProperties } from "react";

/**
 * GoogleIcon — Material Symbols Rounded renderer.
 *
 * Backed by the `material-symbols/rounded.css` font (imported once in
 * `app/globals.css`). The name is a Google icon identifier (e.g.
 * "menu_open", "dock_to_right", "share", "download") rendered as a
 * single ligature inside a <span>, so the glyph inherits `color` from
 * the surrounding button/text token (`var(--fg)`, `var(--fg-muted)`,
 * `var(--accent)` …) without a fill prop.
 *
 * Variation axes are exposed as CSS variables on the wrapper, so a
 * caller can request:
 *   fill   – outlined (0, default) vs filled (1)
 *   weight – 300 / 400 / 500 / 600 / 700
 *   size   – px box; also sets the `opsz` axis to match
 *
 * Same shape + props as the HQ project's GoogleIcon so the design
 * system stays consistent across repos.
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

export function GoogleIcon({
  name,
  size = 18,
  fill = false,
  weight = 400,
  className,
  title,
  style,
}: GoogleIconProps): React.JSX.Element {
  const composed: CSSProperties = {
    fontSize: size,
    width: size,
    height: size,
    lineHeight: `${size}px`,
    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    ...style,
  };

  return (
    <span
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
      role={title ? "img" : undefined}
      className={["material-symbols-rounded", className].filter(Boolean).join(" ")}
      style={composed}
    >
      {name}
    </span>
  );
}
