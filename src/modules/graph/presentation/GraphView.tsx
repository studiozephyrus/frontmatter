"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import { useSnapshot } from "@/modules/vault";
import { useEditorStore } from "@/modules/editor";
import { buildGraph, COLORS, type NoteGroup } from "./graph-data";

// ---------------------------------------------------------------------------
// Minimal types for the lazily-loaded ForceGraph2D component.
// ---------------------------------------------------------------------------

interface FGNode {
  id: string;
  label: string;
  group: NoteGroup;
  color: string;
  x?: number;
  y?: number;
  __r?: number;
  __deg?: number;
}

interface FGLink {
  source: string | FGNode;
  target: string | FGNode;
}

interface ForceGraphMethods {
  zoomToFit: (ms?: number, px?: number) => void;
  centerAt: (x?: number, y?: number, ms?: number) => void;
  zoom: (z?: number, ms?: number) => void;
}

interface ForceGraphProps {
  graphData: { nodes: FGNode[]; links: FGLink[] };
  width?: number;
  height?: number;
  backgroundColor?: string;
  nodeRelSize?: number;
  nodeVal?: (n: FGNode) => number;
  onNodeClick?: (node: FGNode) => void;
  onNodeHover?: (node: FGNode | null) => void;
  nodeCanvasObject?: (
    node: FGNode,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
  ) => void;
  nodePointerAreaPaint?: (
    node: FGNode,
    color: string,
    ctx: CanvasRenderingContext2D,
  ) => void;
  linkColor?: (l: FGLink) => string;
  linkWidth?: (l: FGLink) => number;
  linkDirectionalArrowLength?: (l: FGLink) => number;
  linkDirectionalArrowRelPos?: number;
  linkDirectionalParticles?: (l: FGLink) => number;
  linkDirectionalParticleWidth?: number;
  linkDirectionalParticleColor?: (l: FGLink) => string;
  cooldownTicks?: number;
  onEngineStop?: () => void;
  d3VelocityDecay?: number;
}

type FGComponent = React.ComponentType<
  ForceGraphProps & React.RefAttributes<ForceGraphMethods>
>;

// ---------------------------------------------------------------------------

const GROUP_LABELS: { group: NoteGroup; label: string }[] = [
  { group: "moc", label: "MOC" },
  { group: "project", label: "Project" },
  { group: "course", label: "Course" },
  { group: "research", label: "Research" },
  { group: "markets", label: "Markets" },
  { group: "prompts", label: "Prompts" },
  { group: "marketing", label: "Marketing/QA" },
];

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function linkEndId(end: string | FGNode): string {
  return typeof end === "object" ? end.id : end;
}

interface GraphViewProps {
  open: boolean;
  onClose: () => void;
}

export function GraphView({ open, onClose }: GraphViewProps): React.ReactNode {
  const snapshotState = useSnapshot();
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods | null>(null);
  const [dims, setDims] = useState({ width: 800, height: 600 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [localGraph, setLocalGraph] = useState(false);
  const [theme, setTheme] = useState({
    bg: "#0d0e11",
    fg: "#e9eaec",
    muted: "#6b6f78",
    border: "#222329",
    accent: "#6e79e8",
  });

  const ForceGraph2D = useMemo<FGComponent | null>(() => {
    if (!open) return null;
    return dynamic(() => import("react-force-graph-2d"), {
      ssr: false,
    }) as unknown as FGComponent;
  }, [open]);

  // Build graph + adjacency + degrees.
  const { graphData, adjacency, activePath } = useMemo(() => {
    const empty = { nodes: [] as FGNode[], links: [] as FGLink[] };
    if (!snapshotState.snapshot)
      return { graphData: empty, adjacency: new Map<string, Set<string>>(), activePath: null as string | null };

    const built = buildGraph(snapshotState.snapshot.notes);
    const adj = new Map<string, Set<string>>();
    const deg = new Map<string, number>();
    for (const n of built.nodes) {
      adj.set(n.id, new Set());
      deg.set(n.id, 0);
    }
    for (const l of built.links) {
      adj.get(l.source)?.add(l.target);
      adj.get(l.target)?.add(l.source);
      deg.set(l.source, (deg.get(l.source) ?? 0) + 1);
      deg.set(l.target, (deg.get(l.target) ?? 0) + 1);
    }
    const nodes: FGNode[] = built.nodes.map((n) => {
      const d = deg.get(n.id) ?? 0;
      return { ...n, __deg: d, __r: 3 + Math.sqrt(d) * 1.4 };
    });
    return {
      graphData: { nodes, links: built.links as FGLink[] },
      adjacency: adj,
      activePath: useEditorStore.getState().activePath,
    };
  }, [snapshotState.snapshot]);

  // Local graph: restrict to the active note + its direct neighbors.
  const displayData = useMemo(() => {
    if (!localGraph || !activePath) return graphData;
    const keep = new Set<string>([activePath, ...(adjacency.get(activePath) ?? [])]);
    return {
      nodes: graphData.nodes.filter((n) => keep.has(n.id)),
      links: graphData.links.filter(
        (l) => keep.has(linkEndId(l.source)) && keep.has(linkEndId(l.target)),
      ),
    };
  }, [localGraph, activePath, graphData, adjacency]);

  // Resolve theme colors when the modal opens.
  useEffect(() => {
    if (!open) return;
    setTheme({
      bg: cssVar("--bg", "#0d0e11"),
      fg: cssVar("--fg", "#e9eaec"),
      muted: cssVar("--muted", "#6b6f78"),
      border: cssVar("--border-strong", "#2e2f37"),
      accent: cssVar("--accent", "#6e79e8"),
    });
  }, [open]);

  // Close on Escape.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );
  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  // Measure container.
  useEffect(() => {
    if (!open) return;
    function measure() {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDims({ width, height });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  const handleNodeClick = useCallback(
    (node: FGNode) => {
      if (node.id) {
        useEditorStore.getState().openTab(node.id);
        onClose();
      }
    },
    [onClose],
  );

  const isHighlighted = useCallback(
    (id: string): boolean => {
      if (!hoverId) return true;
      if (id === hoverId) return true;
      return adjacency.get(hoverId)?.has(id) ?? false;
    },
    [hoverId, adjacency],
  );

  const linkActive = useCallback(
    (l: FGLink): boolean => {
      if (!hoverId) return false;
      const s = linkEndId(l.source);
      const t = linkEndId(l.target);
      return s === hoverId || t === hoverId;
    },
    [hoverId],
  );

  // Canvas node renderer: degree-sized dot + always-on label, with hover dimming.
  const nodeCanvasObject = useCallback(
    (node: FGNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const r = node.__r ?? 4;
      const deg = node.__deg ?? 0;
      const focusMode = hoverId !== null;
      const hi = isHighlighted(node.id);
      const isActive = node.id === activePath;

      ctx.globalAlpha = hi ? 1 : 0.15;

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Ring for hovered / active note
      if ((hoverId && node.id === hoverId) || isActive) {
        ctx.lineWidth = 1.5 / globalScale;
        ctx.strokeStyle = isActive ? theme.accent : theme.fg;
        ctx.stroke();
      }

      // Progressive label disclosure to avoid clutter when zoomed out:
      // - hover focus mode → only the hovered node + neighbors
      // - otherwise → the active note, anything once zoomed in (>1.4), or
      //   hubs whose `zoom × (degree+1)` clears the threshold (big hubs first).
      const showLabel = focusMode
        ? hi
        : isActive || globalScale > 1.4 || globalScale * (deg + 1) > 3.2;
      if (showLabel) {
        const fontSize = Math.max(2.5, 11 / globalScale);
        ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = hi ? theme.fg : theme.muted;
        ctx.fillText(node.label, x, y + r + 1.5 / globalScale);
      }
      ctx.globalAlpha = 1;
    },
    [isHighlighted, hoverId, activePath, theme],
  );

  const nodePointerAreaPaint = useCallback(
    (node: FGNode, color: string, ctx: CanvasRenderingContext2D) => {
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const r = (node.__r ?? 4) + 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
    },
    [],
  );

  const linkColor = useCallback(
    (l: FGLink): string => {
      if (linkActive(l)) return theme.accent;
      if (hoverId) return "rgba(130,130,140,0.08)";
      return "rgba(130,130,140,0.22)";
    },
    [linkActive, hoverId, theme],
  );
  const linkWidth = useCallback((l: FGLink): number => (linkActive(l) ? 2 : 0.6), [linkActive]);
  const linkArrow = useCallback((l: FGLink): number => (linkActive(l) ? 3.5 : 0), [linkActive]);
  const linkParticles = useCallback((l: FGLink): number => (linkActive(l) ? 3 : 0), [linkActive]);
  const linkParticleColor = useCallback(() => theme.accent, [theme]);

  const handleEngineStop = useCallback(() => {
    fgRef.current?.zoomToFit(500, 60);
  }, []);

  function focusSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = displayData.nodes.find((n) => n.label.toLowerCase().includes(q));
    if (match) {
      setHoverId(match.id);
      fgRef.current?.centerAt(match.x ?? 0, match.y ?? 0, 700);
      fgRef.current?.zoom(4, 700);
    }
  }

  if (!open) return null;

  const nodeCount = displayData.nodes.length;
  const linkCount = displayData.links.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Knowledge graph"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.6rem 1rem",
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}
      >
        <span style={{ color: theme.fg, fontWeight: 650, fontSize: "0.9rem" }}>
          Knowledge Graph
        </span>
        <span style={{ color: theme.muted, fontSize: "0.78rem" }}>
          {nodeCount} notes · {linkCount} links
        </span>
        <button
          onClick={() => setLocalGraph((v) => !v)}
          aria-pressed={localGraph}
          disabled={!activePath}
          className="sgnk-btn"
          style={{ height: 28, opacity: activePath ? 1 : 0.5 }}
          title={activePath ? "Toggle local graph (active note + neighbors)" : "Open a note to use local graph"}
        >
          {localGraph ? "Local" : "Global"}
        </button>
        <form onSubmit={focusSearch} style={{ marginLeft: "auto" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a note…"
            className="sgnk-input"
            style={{ width: "200px" }}
            aria-label="Find a note in the graph"
          />
        </form>
        <button onClick={onClose} aria-label="Close graph" className="sgnk-icon-btn"><GoogleIcon name="close" size={16} weight={500} /></button>
      </div>

      {/* Graph area */}
      <div ref={containerRef} style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {(!ForceGraph2D || snapshotState.loading) && (
          <p style={{ color: theme.muted, padding: "2rem" }}>Loading graph…</p>
        )}
        {snapshotState.error && (
          <p style={{ color: theme.muted, padding: "2rem" }}>Error: {snapshotState.error}</p>
        )}
        {ForceGraph2D && snapshotState.snapshot && nodeCount === 0 && (
          <p style={{ color: theme.muted, padding: "2rem" }}>
            No notes to graph yet.
          </p>
        )}
        {ForceGraph2D && snapshotState.snapshot && nodeCount > 0 && (
          <ForceGraph2D
            ref={fgRef}
            graphData={displayData}
            width={dims.width}
            height={dims.height}
            backgroundColor={theme.bg}
            nodeRelSize={4}
            nodeVal={(n) => (n.__deg ?? 0) + 1}
            nodeCanvasObject={nodeCanvasObject}
            nodePointerAreaPaint={nodePointerAreaPaint}
            onNodeClick={handleNodeClick}
            onNodeHover={(n) => setHoverId(n ? n.id : null)}
            linkColor={linkColor}
            linkWidth={linkWidth}
            linkDirectionalArrowLength={linkArrow}
            linkDirectionalArrowRelPos={1}
            linkDirectionalParticles={linkParticles}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleColor={linkParticleColor}
            cooldownTicks={120}
            onEngineStop={handleEngineStop}
            d3VelocityDecay={0.28}
          />
        )}

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            left: "12px",
            bottom: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 14px",
            maxWidth: "60%",
            padding: "10px 12px",
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: "10px",
            opacity: 0.95,
          }}
        >
          {GROUP_LABELS.map(({ group, label }) => (
            <span
              key={group}
              style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: theme.muted }}
            >
              <span
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: COLORS[group],
                  display: "inline-block",
                }}
              />
              {label}
            </span>
          ))}
        </div>

        {/* Hint */}
        <div
          style={{
            position: "absolute",
            right: "12px",
            bottom: "12px",
            fontSize: "11px",
            color: theme.muted,
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            padding: "6px 10px",
            opacity: 0.9,
          }}
        >
          drag to pan · scroll to zoom · hover to focus · click to open
        </div>
      </div>
    </div>
  );
}
