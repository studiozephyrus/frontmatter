import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Keep the headless-chromium packages external so the bundler does not
  // relocate them and strip their native binary (the brotli pack under bin/).
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // Force the chromium brotli pack into the PDF function's serverless trace —
  // it is resolved by runtime path, which file-tracing can't detect. The
  // previous narrow `bin/**` glob + bracketed route key wasn't landing the
  // binary in the lambda (runtime: ".../bin does not exist"); a glob route
  // key + the whole package guarantees the brotli binary ships.
  outputFileTracingIncludes: {
    "/api/export/pdf/**": ["./node_modules/@sparticuz/chromium/**"],
  },
  async headers() {
    // Always-safe headers on every path (incl. _next/static, which the proxy
    // matcher skips). These never break an app.
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
    ];
    // ENFORCED, tight CSP for the public note renderer only — untrusted,
    // attacker-authored content shown to anonymous visitors, and no editor
    // there (so no unsafe-eval needed). The authed editor stays report-only
    // in proxy.ts (single trusted tenant).
    const publicCsp = [
      "default-src 'self'",
      "img-src 'self' data: blob: https://avatars.githubusercontent.com",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self'",
      "media-src 'self' blob: https:",
      "frame-src 'self' blob: https://www.youtube-nocookie.com https://player.vimeo.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; ");
    return [
      { source: "/:path*", headers: base },
      { source: "/p/:slug*", headers: [{ key: "Content-Security-Policy", value: publicCsp }] },
    ];
  },
};

export default nextConfig;
