/**
 * GET /api/export/pdf/<vault-path>
 *
 * Renders the requested vault note to PDF using headless Chromium
 * (@sparticuz/chromium + puppeteer-core).
 *
 * - Requires an authenticated session → 401 if not.
 * - Joins the [...path] segments to obtain the vault file path.
 * - Renders the markdown to a server-safe HTML document (mermaid via CDN,
 *   KaTeX via CDN + rehype-katex pre-rendered markup).
 * - Launches a headless browser, loads the HTML, waits for mermaid to render,
 *   then snapshots a PDF.
 * - Returns the PDF bytes with appropriate headers.
 *
 * ALL heavy deps (pdf-doc, chromium, puppeteer-core) are dynamically imported
 * inside the handler so the Next.js/Turbopack bundler never statically analyzes
 * or includes react-dom/server (used in pdf-doc.ts) in any client bundle, and
 * chromium/puppeteer-core are never bundled at all.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { FileNotFoundError } from "@/shared/domain/errors";
import { InvalidPathError } from "@/modules/vault/application/get-file";

const JSON_HEADERS = { "content-type": "application/json" } as const;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  // ── Auth gate ─────────────────────────────────────────────────────────────
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  // ── Resolve vault path ────────────────────────────────────────────────────
  const { path: segments } = await params;
  if (!segments || segments.length === 0) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "path is required" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }
  const vaultPath = segments.join("/");
  const basename = segments[segments.length - 1] ?? vaultPath;
  const title = basename.endsWith(".md") ? basename.slice(0, -3) : basename;

  // ── Fetch file from vault ─────────────────────────────────────────────────
  let content: string;
  try {
    const result = await container.getFile(vaultPath);
    content = result.content;
  } catch (err) {
    if (err instanceof FileNotFoundError || err instanceof InvalidPathError) {
      return new Response(
        JSON.stringify({
          error: "not_found",
          detail: err instanceof Error ? err.message : "file not found",
        }),
        {
          status: err instanceof InvalidPathError ? 400 : 404,
          headers: JSON_HEADERS,
        },
      );
    }
    const message = err instanceof Error ? err.message : "upstream error";
    return new Response(
      JSON.stringify({ error: "upstream_failure", detail: message }),
      { status: 502, headers: JSON_HEADERS },
    );
  }

  // ── Build server-safe HTML document ──────────────────────────────────────
  // Dynamic import keeps react-dom/server out of the static bundle graph so
  // Turbopack does not raise a client/server boundary error.
  const { renderPdfHtmlDocument } = await import(
    "@/modules/export/presentation/pdf-doc"
  );
  // Page margin shared with the print stylesheet so screen-print and
  // server-PDF stay identical.
  const { PRINT_PAGE_MARGIN: M } = await import(
    "@/modules/export/presentation/print-css"
  );
  const html = renderPdfHtmlDocument(content, title);

  // ── Launch headless Chromium and render PDF ───────────────────────────────
  // Both packages are dynamically imported so they are never bundled and
  // build-time tree-shaking never touches their native binaries.
  let browser: import("puppeteer-core").Browser | null = null;
  try {
    const puppeteer = (await import("puppeteer-core")).default;

    // The @sparticuz/chromium binary is a Linux executable, so it only runs
    // on the serverless Linux runtime (Vercel/Lambda). On a non-Linux dev
    // machine (macOS/Windows) spawning it throws `spawn ENOEXEC`, so there we
    // launch the developer's own installed Chrome via puppeteer-core's
    // `channel`. Platform — not a VERCEL env flag — is the reliable signal
    // (a local `.env.local` may define VERCEL for other reasons).
    const useBundledChromium = process.platform === "linux";

    if (useBundledChromium) {
      const chromium = (await import("@sparticuz/chromium")).default;
      // CHROMIUM_PACK_URL (optional): load the brotli pack from a remote tar
      // instead of the bundled binary. Escape hatch if the lambda ever loses
      // its traced bin/ again. Default uses the bundled binary, which
      // next.config traces into the function via outputFileTracingIncludes.
      const packUrl = process.env["CHROMIUM_PACK_URL"];
      const executablePath = packUrl
        ? await chromium.executablePath(packUrl)
        : await chromium.executablePath();
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: true,
      });
    } else {
      // Local dev: use an installed Chrome. LOCAL_CHROME_PATH overrides the
      // auto-discovered stable channel if the developer's binary is elsewhere.
      const localPath = process.env["LOCAL_CHROME_PATH"];
      browser = await puppeteer.launch({
        ...(localPath ? { executablePath: localPath } : { channel: "chrome" }),
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();
    // setContent in puppeteer-core ≥ v22 does not accept "networkidle0";
    // use "load" and then allow time for the mermaid CDN script to render.
    await page.setContent(html, { waitUntil: "load" });

    // Wait for the Google Sans web fonts to actually finish downloading so
    // the PDF renders in the same typeface as the preview (not a fallback).
    // document.fonts.ready resolves once all @font-face loads settle.
    try {
      await page.evaluate(() => (document as Document).fonts.ready);
    } catch {
      // Non-fatal: if the font API is unavailable the fallback stack renders.
    }

    // Give the mermaid CDN module time to download and render diagrams.
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: M, bottom: M, left: M, right: M },
    });

    // page.pdf() returns Uint8Array; convert buffer for the Response body.
    const pdf = pdfBytes.buffer as ArrayBuffer;

    const safeTitle = title.replace(/[^\w\-. ]/g, "_");
    return new Response(pdf, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${safeTitle}.pdf"`,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "headless chromium error";
    return new Response(
      JSON.stringify({
        error: "pdf_render_failed",
        detail: message,
        hint: "Server-side PDF requires the @sparticuz/chromium binary available at runtime (Vercel serverless). Local dev may not have the binary — use Print / PDF instead.",
      }),
      { status: 502, headers: JSON_HEADERS },
    );
  } finally {
    if (browser !== null) {
      try {
        await browser.close();
      } catch {
        // ignore close errors
      }
    }
  }
}
