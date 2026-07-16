/**
 * Next.js instrumentation hook.
 *
 * Registered automatically by Next at server startup. Currently provides:
 *
 *  - `register()`     — runtime-conditional bootstrap. No-op for now; the
 *                       hook is where OTel exporters or a Sentry init would
 *                       be wired up.
 *  - `onRequestError` — receives server-side errors (route handlers, server
 *                       components, server actions) with request context.
 *                       Logged in a structured way so a future reporter
 *                       (Sentry / Logflare / OTel) just needs the body of
 *                       this function flipped.
 *
 * No external SDKs are pulled in here so this stays free of build-time deps;
 * swap the console call for `Sentry.captureException(...)` once `SENTRY_DSN`
 * is set in the environment.
 */
import type { Instrumentation } from "next";

export async function register(): Promise<void> {
  // Hook intentionally left empty. Reserved for OTel SDK init or Sentry init
  // gated on env vars (e.g. SENTRY_DSN, OTEL_EXPORTER_OTLP_ENDPOINT).
}

export const onRequestError: Instrumentation.onRequestError = (
  err,
  request,
  context,
) => {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  console.error("[sgnk-md] request-error", {
    message,
    stack,
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
