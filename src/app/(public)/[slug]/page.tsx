/**
 * Public note page: /p/[slug]
 *
 * Renders any note whose frontmatter `public_slug:` matches. Unauthenticated.
 * Returns 404 when the slug is unknown OR claimed by multiple notes
 * (conflict — public stays hidden until the owner resolves).
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { shareApi } from "@/container/dependency-container";
import { PublicNoteView } from "@/modules/share/presentation/PublicNoteView";

// ISR: serve from cache for 60s, then regenerate on next request. `dynamicParams`
// allows arbitrary slugs (not in a static prebuild list). `force-dynamic` was
// previously set but conflicts with revalidate — drop it so the CDN can cache.
export const revalidate = 60;
export const dynamicParams = true;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const note = await shareApi.resolvePublicNote(slug);
  if (!note) return { title: "Not found · frontmatter" };
  return {
    title: `${note.title} · frontmatter`,
    description: note.content.slice(0, 160).replace(/\s+/g, " "),
    openGraph: { title: note.title, type: "article" },
    robots: { index: true, follow: true },
  };
}

export default async function PublicNotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = await shareApi.resolvePublicNote(slug);
  if (!note) notFound();
  return <PublicNoteView title={note.title} content={note.content} slug={note.slug} />;
}
