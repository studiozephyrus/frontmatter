import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "frontmatter",
  description: "Hello world starter for frontmatter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
