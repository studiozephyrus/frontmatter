/**
 * Legacy redirect: /p/<slug> → /<slug>
 *
 * Public note URLs moved off the `/p/` prefix to expose slugs at the
 * root (`md.sgnk.ai/<slug>`). This route keeps every previously-shared
 * link working — a 301 sends crawlers and bookmarks to the new URL.
 */
import { permanentRedirect } from "next/navigation";

export const dynamicParams = true;
export const revalidate = false;

type Params = { slug: string };

export default async function LegacyPublicRedirect({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}
