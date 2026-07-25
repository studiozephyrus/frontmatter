import type { Metadata, Viewport } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import { PWARegister, TauriBridge } from "@/modules/app-shell";

// Single typeface across the app — Google Sans (the system family
// behind Workspace + Pixel). Hierarchy lives in weight (400/500/600/700,
// the four faces Google ships publicly), not in coloured text.
// `next/font/google` self-hosts the woff2 so we avoid a runtime request
// to Google Fonts + the post-PostCSS `@import` ordering trap that
// Tailwind v4's compiled `@layer` rules create for any later
// `@import url(...)`. The `--font-sans-google` variable is consumed
// by globals.css's `--font-sans` token.
const googleSans = Google_Sans({
  variable: "--font-sans-google",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://frontmatter.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "frontmatter",
    template: "%s — frontmatter",
  },
  description: "Your Markdown HQ — a GitHub-backed markdown workspace with share links, graph, and a native macOS app.",
  applicationName: "frontmatter",
  appleWebApp: {
    capable: true,
    title: "frontmatter",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    siteName: "frontmatter",
    title: "frontmatter — Your markdown vault, in any browser",
    description: "A GitHub-backed markdown workspace. Write, link, graph, share by URL, edit anywhere — web, mobile, native app.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "frontmatter — Your markdown vault, in any browser",
    description: "GitHub-backed markdown workspace with share links, graph, and a native macOS app.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={googleSans.variable} suppressHydrationWarning>
      <head>
        <script src="/theme-init.js" />
      </head>
      <body>
        {children}
        <PWARegister />
        <TauriBridge />
      </body>
    </html>
  );
}
