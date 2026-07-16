/**
 * Rich media embeds for `![](url)` image syntax.
 *
 * When the "image" URL is actually a YouTube/Vimeo link, a video/audio file,
 * or a PDF, render the appropriate player/frame instead of an <img>. Keeps the
 * markdown portable (still `![](…)`) while giving Notion/Obsidian-style embeds.
 */
import type { JSX } from "react";
import { rewriteVaultImageSrc } from "./image-src";

type Embed =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "video"; url: string }
  | { kind: "audio"; url: string }
  | { kind: "pdf"; url: string; remote: boolean };

function youtubeId(url: string): string | null {
  const m =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/.exec(url);
  return m ? (m[1] ?? null) : null;
}

function vimeoId(url: string): string | null {
  const m = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);
  return m ? (m[1] ?? null) : null;
}

export function detectEmbed(url: string): Embed | null {
  const remote = /^https?:\/\//i.test(url);
  if (!remote) {
    // Local vault media — resolve to the same-origin raw endpoint so it loads
    // (previously emitted a page-relative URL → 404).
    const resolved = rewriteVaultImageSrc(url);
    if (/\.(mp4|webm|ogv|mov)$/i.test(url)) return { kind: "video", url: resolved };
    if (/\.(mp3|wav|m4a|oga|ogg)$/i.test(url)) return { kind: "audio", url: resolved };
    if (/\.pdf$/i.test(url)) return { kind: "pdf", url: resolved, remote: false };
    return null;
  }
  const yt = youtubeId(url);
  if (yt) return { kind: "youtube", id: yt };
  const vm = vimeoId(url);
  if (vm) return { kind: "vimeo", id: vm };
  if (/\.(mp4|webm|ogv|mov)$/i.test(url)) return { kind: "video", url };
  if (/\.(mp3|wav|m4a|oga|ogg)$/i.test(url)) return { kind: "audio", url };
  if (/\.pdf$/i.test(url)) return { kind: "pdf", url, remote: true };
  return null;
}

const frameStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  margin: "0.9em 0",
};

export function MediaEmbed({ embed, title }: { embed: Embed; title: string }): JSX.Element {
  switch (embed.kind) {
    case "youtube":
      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${embed.id}`}
          title={title || "YouTube video"}
          style={frameStyle}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    case "vimeo":
      return (
        <iframe
          src={`https://player.vimeo.com/video/${embed.id}`}
          title={title || "Vimeo video"}
          style={frameStyle}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    case "video":
      return <video src={embed.url} controls preload="metadata" style={{ maxWidth: "100%", borderRadius: "var(--radius)", margin: "0.9em 0" }} />;
    case "audio":
      return <audio src={embed.url} controls preload="metadata" style={{ width: "100%", margin: "0.6em 0" }} />;
    case "pdf":
      return (
        <iframe
          src={embed.url}
          title={title || "PDF"}
          style={{ ...frameStyle, aspectRatio: "4 / 5" }}
          loading="lazy"
          referrerPolicy="no-referrer"
          // Remote PDFs come from untrusted note content — sandbox to block any
          // script/navigation if the server returns HTML. Local vault PDFs are
          // same-origin and trusted (no sandbox needed for the native viewer).
          {...(embed.remote ? { sandbox: "" } : {})}
        />
      );
  }
}
