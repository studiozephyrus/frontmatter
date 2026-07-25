import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "frontmatter — Your markdown vault, in any browser",
    short_name: "frontmatter",
    description: "A GitHub-backed markdown workspace with share links, graph, and a native macOS app.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#1a1a1a",
    theme_color: "#1a1a1a",
    icons: [
      { src: "/favicon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
