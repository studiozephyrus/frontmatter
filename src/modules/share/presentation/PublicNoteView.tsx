"use client";

import { Markdown } from "@/modules/preview";
import "./public-note.css";

interface PublicNoteViewProps {
  title: string;
  content: string;
  slug: string;
}

export function PublicNoteView({ title, content, slug }: PublicNoteViewProps) {
  const hasBody = content.trim().length > 0;
  return (
    <div className="public-note-shell">
      <header className="public-note-header">
        <p className="public-note-eyebrow">
          <span className="public-note-dot" aria-hidden /> Public note
          <span className="public-note-sep">·</span>
          <code>/p/{slug}</code>
        </p>
        <h1 className="public-note-title">{title}</h1>
      </header>
      <article className="public-note-body markdown-body">
        {hasBody
          ? <Markdown content={content} />
          : <p className="public-note-empty">This note has no body yet.</p>}
      </article>
      <footer className="public-note-footer">
        <span>Hosted on </span>
        <a href="/" rel="noreferrer">frontmatter.in</a>
      </footer>
    </div>
  );
}
