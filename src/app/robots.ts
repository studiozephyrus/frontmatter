import type { MetadataRoute } from "next";

const SITE = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://frontmatter.in";

/**
 * Crawler policy: the vault is private + auth-gated. Public shares live
 * at `/<slug>` (legacy `/p/<slug>` 301-redirects to the new URL). The
 * editor + APIs stay off-limits to crawlers.
 *
 * Listing `/` as allowed AND `/api/` + `/_next/` as disallowed lets
 * crawlers index any public slug at the root without enumerating them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        // `/p/` is the legacy published-page path; the plan says published
        // pages are not indexed (plan v5, sharing). The root slug stays as it
        // was until the founders decide the indexing question (A10).
        disallow: ["/api/", "/_next/", "/(vault)", "/p/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
