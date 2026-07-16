import type { Components } from "react-markdown";
import { MermaidBlock } from "@/modules/preview/presentation/mermaid-block";
import { toggleTaskAtLine, toggleTaskAtOccurrence } from "@/modules/editor";
import { CalloutBox, parseCalloutHeader } from "./callout";
import { transformChildren } from "./wikilinks";
import { rewriteVaultImageSrc } from "./image-src";
import { detectEmbed, MediaEmbed } from "./embeds";
import { getAnchorTargetProps } from "./html-policy";

interface CheckboxCounter { count: number }

function extractSourceLine(n: unknown): number | undefined {
  if (n === null || n === undefined || typeof n !== "object") return undefined;
  const nodeObj = n as Record<string, unknown>;
  const pos = nodeObj["position"];
  if (pos === null || pos === undefined || typeof pos !== "object") return undefined;
  const posObj = pos as Record<string, unknown>;
  const start = posObj["start"];
  if (start === null || start === undefined || typeof start !== "object") return undefined;
  const startObj = start as Record<string, unknown>;
  const line = startObj["line"];
  return typeof line === "number" ? line : undefined;
}

/**
 * Build the react-markdown component override map.
 * Pure function — called from <Markdown> on every render with the current
 * content + handlers; counters are scoped to a single render pass.
 */
export function buildComponents(
  onWikilink: ((target: string) => void) | undefined,
  basenameToPath: Map<string, string> | undefined,
  content: string,
  onToggleTask: ((newContent: string) => void) | undefined,
  depth: number,
  _onEdit: ((newContent: string) => void) | undefined,
): Components {
  const counter: CheckboxCounter = { count: 0 };
  const lines = content.split("\n");

  return {
    li({ children, ...props }) {
      const checked = "data-checked" in props ? props["data-checked"] : undefined;
      const node = "node" in props ? (props as Record<string, unknown>)["node"] : undefined;
      const sourceLine = extractSourceLine(node);
      const sourceLineText =
        typeof sourceLine === "number" ? lines[sourceLine - 1] : undefined;
      const sourceTaskMatch = sourceLineText?.match(/^\s*[-*+]\s+\[([ xX])\]/) ?? null;
      const sourceChecked =
        sourceTaskMatch !== null ? sourceTaskMatch[1]?.toLowerCase() === "x" : undefined;
      const className = (props as Record<string, unknown>)["className"];
      const hasTaskClass =
        typeof className === "string"
          ? className.split(/\s+/).includes("task-list-item")
          : Array.isArray(className) && className.some((value) => value === "task-list-item");
      const isTask =
        (checked !== undefined && checked !== null) ||
        sourceChecked !== undefined ||
        hasTaskClass;
      if (isTask) {
        const isChecked =
          checked !== undefined && checked !== null
            ? checked === true || checked === "true"
            : sourceChecked ?? false;
        const occurrenceIndex = counter.count++;

        function handleToggle(): void {
          if (!onToggleTask) return;
          const newContent =
            typeof sourceLine === "number"
              ? toggleTaskAtLine(content, sourceLine)
              : toggleTaskAtOccurrence(content, occurrenceIndex);
          onToggleTask(newContent);
        }

        const { node: _node, ...safeProps } =
          props as Record<string, unknown> & { node?: unknown };
        void _node;

        return (
          <li
            className="task-list-item"
            {...(safeProps as React.HTMLAttributes<HTMLLIElement>)}
            data-checked={undefined}
          >
            <input
              type="checkbox"
              readOnly={!onToggleTask}
              checked={isChecked}
              onChange={onToggleTask ? handleToggle : undefined}
              className="task-list-checkbox"
              style={{ cursor: onToggleTask ? "pointer" : "default" }}
            />
            {transformChildren(children, basenameToPath, onWikilink, depth)}
          </li>
        );
      }

      const { node: _n, ...safeProps } =
        props as Record<string, unknown> & { node?: unknown };
      void _n;
      return (
        <li {...(safeProps as React.HTMLAttributes<HTMLLIElement>)}>
          {transformChildren(children, basenameToPath, onWikilink, depth)}
        </li>
      );
    },

    // Forward the `id` injected by rehype-slug so the Outline's
    // getElementById(slug) scroll-to-heading actually works.
    h1: ({ children, id }) => <h1 id={id}>{transformChildren(children, basenameToPath, onWikilink, depth)}</h1>,
    h2: ({ children, id }) => <h2 id={id}>{transformChildren(children, basenameToPath, onWikilink, depth)}</h2>,
    h3: ({ children, id }) => <h3 id={id}>{transformChildren(children, basenameToPath, onWikilink, depth)}</h3>,
    h4: ({ children, id }) => <h4 id={id}>{transformChildren(children, basenameToPath, onWikilink, depth)}</h4>,
    h5: ({ children, id }) => <h5 id={id}>{transformChildren(children, basenameToPath, onWikilink, depth)}</h5>,
    h6: ({ children, id }) => <h6 id={id}>{transformChildren(children, basenameToPath, onWikilink, depth)}</h6>,

    td: ({ children }) => <td>{transformChildren(children, basenameToPath, onWikilink, depth)}</td>,
    th: ({ children }) => <th>{transformChildren(children, basenameToPath, onWikilink, depth)}</th>,

    strong: ({ children }) => <strong>{transformChildren(children, basenameToPath, onWikilink, depth)}</strong>,
    em: ({ children }) => <em>{transformChildren(children, basenameToPath, onWikilink, depth)}</em>,

    blockquote({ children }) {
      const callout = parseCalloutHeader(children);
      if (callout) {
        return <CalloutBox type={callout.type} title={callout.title} body={callout.body} />;
      }
      return <blockquote className="markdown-blockquote">{children}</blockquote>;
    },

    code({ className, children }) {
      const language = /language-(\w+)/.exec(className ?? "")?.[1];
      if (language === "mermaid") {
        return <MermaidBlock code={String(children).trim()} />;
      }
      return <code className={className}>{children}</code>;
    },

    p({ children }) {
      return <p>{transformChildren(children, basenameToPath, onWikilink, depth)}</p>;
    },

    /**
     * Anchor renderer — three regimes:
     *   • Hash-only links (`#heading`) — leave to default scroll-to-id.
     *   • Same-origin / relative links — open in the current tab so
     *     vault-internal navigation (public note ↔ note) feels natural.
     *   • Everything else — treated as external: open in a new tab,
     *     `rel="noopener noreferrer"` to keep us off the opener chain.
     */
    a({ href, children, ...rest }) {
      const { node: _node, ...safeRest } =
        rest as Record<string, unknown> & { node?: unknown };
      void _node;
      const url = typeof href === "string" ? href : "";
      return (
        <a
          href={url}
          {...(safeRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          {...getAnchorTargetProps(url)}
        >
          {transformChildren(children, basenameToPath, onWikilink, depth)}
        </a>
      );
    },

    img({ src, alt, ...rest }) {
      const { node: _node, ...safeRest } =
        rest as Record<string, unknown> & { node?: unknown };
      void _node;
      const rawSrc = typeof src === "string" ? src : "";
      // Rich embeds: YouTube/Vimeo/video/audio/PDF rendered as players.
      const embed = detectEmbed(rawSrc);
      if (embed) return <MediaEmbed embed={embed} title={alt ?? ""} />;
      const resolvedSrc = rewriteVaultImageSrc(rawSrc);
      return (
        <img
          src={resolvedSrc}
          alt={alt ?? ""}
          style={{ maxWidth: "100%" }}
          {...(safeRest as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
      );
    },

    input() {
      return null;
    },
  };
}
