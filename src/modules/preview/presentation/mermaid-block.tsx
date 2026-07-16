"use client";

// NOTE: innerHTML is used here only for mermaid-generated SVG output (not user-provided HTML).
// Mermaid's render() returns sanitized SVG strings — this is an accepted pattern per mermaid docs.

import { useEffect, useRef, useState } from "react";

interface MermaidBlockProps {
  code: string;
}

let _idCounter = 0;

export function MermaidBlock({ code }: MermaidBlockProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef<string>(`mermaid-${++_idCounter}`);

  useEffect(() => {
    let cancelled = false;
    const id = idRef.current;

    async function renderDiagram(): Promise<void> {
      try {
        const mermaid = (await import("mermaid")).default;
        // securityLevel:strict → DOMPurify-sanitized output (note content is untrusted).
        mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "strict" });
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg; // mermaid output is trusted SVG (sanitized by mermaid)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error !== null) {
    return (
      <div className="mermaid-error">
        <pre className="mermaid-error__code">{code}</pre>
        <p className="mermaid-error__note">Diagram render error: {error}</p>
      </div>
    );
  }

  return <div ref={containerRef} className="mermaid-block" />;
}
