"use client";

import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";
import { buildComponents } from "./markdown/components";
import { createRehypeHtmlPolicy, DISALLOWED_RAW_HTML_ELEMENTS } from "./markdown/html-policy";
export { rewriteVaultImageSrc } from "./markdown/image-src";

const DISALLOWED_RAW_HTML_ELEMENT_LIST = [...DISALLOWED_RAW_HTML_ELEMENTS];

interface MarkdownProps {
  content: string;
  onWikilink?: ((target: string) => void) | undefined;
  /** Map from basename (no .md extension) → full vault path. Used to resolve [[wikilinks]]. */
  basenameToPath?: Map<string, string> | undefined;
  /** Called when a task checkbox is toggled. Receives the full updated content. */
  onToggleTask?: ((newContent: string) => void) | undefined;
  /** Called when a table cell is edited. Receives the full updated content. */
  onEdit?: ((newContent: string) => void) | undefined;
  /** Current embed depth. Used to guard against deep/cyclic transclusion. */
  depth?: number | undefined;
}

export const Markdown = memo(function Markdown({
  content,
  onWikilink,
  basenameToPath,
  onToggleTask,
  onEdit,
  depth = 0,
}: MarkdownProps): React.JSX.Element {
  const components = useMemo(
    () => buildComponents(
      onWikilink,
      basenameToPath,
      content,
      onToggleTask,
      depth,
      onEdit,
    ),
    [basenameToPath, content, depth, onEdit, onToggleTask, onWikilink],
  );

  const rehypePlugins = useMemo(
    () => [
      rehypeRaw,
      createRehypeHtmlPolicy(content),
      rehypeKatex,
      rehypeHighlight,
      rehypeSlug,
    ],
    [content],
  );

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkFrontmatter, remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={rehypePlugins}
        disallowedElements={DISALLOWED_RAW_HTML_ELEMENT_LIST}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
