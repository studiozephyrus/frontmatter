import type { MetadataRoute } from "next";

const SITE = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://md.sgnk.ai";

/**
 * sgnk-md sitemap.
 *
 * The vault itself is auth-gated and private, so the sitemap intentionally
 * lists only the public surface: the marketing/home entry and the login page.
 * Public shared notes (/p/<slug>) are discovered + listed at request time by
 * the share resolver, but enumerating every share here would require a
 * snapshot read on every crawl — keep it static for now.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE}/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
