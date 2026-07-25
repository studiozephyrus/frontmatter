/**
 * Pure domain for public-share slugs. No framework imports, no env reads.
 *
 * A slug is the user-chosen identifier in the public URL `/<slug>`.
 * Distinct from the page title — the user picks it explicitly when sharing.
 *
 * Constraints:
 *   - 1..60 chars
 *   - lowercase letters, digits, hyphens
 *   - no leading/trailing hyphen
 *   - no consecutive hyphens
 *   - reserved words (see RESERVED_SLUGS) rejected
 *
 * Reserved words are the comprehensive set of first-segment paths the
 * app owns or reasonably might own. Slugs sit at the ROOT of the URL
 * (frontmatter.in/<slug>), so any future static route would shadow a
 * conflicting slug. The list is generous on purpose — false-positive
 * rejections are recoverable (user picks another slug); false-negative
 * (slug clashes with future route) is a bug shipped to users.
 *
 * Add to this list BEFORE adding the matching route. The slug validator
 * lives in the domain layer specifically so this rule is part of the
 * type system (no infra dependency); CI catches drift.
 */

export const SLUG_MAX_LEN = 60;
export const SLUG_MIN_LEN = 1;

/**
 * Reserved slug set — organised by topic. The grouping is documentation
 * only (Set ignores order), so when a new route lands you can scan the
 * relevant section and confirm it's already covered.
 *
 * Picking this list is a trade-off:
 *   • Generous (current choice) → more user friction at slug creation,
 *     near-zero risk of a slug shadowing a future route.
 *   • Sparse → more freedom for users, but every new top-level route
 *     becomes a potential breaking change for someone's bookmarked URL.
 *
 * We err generous because slug rejection is fixable in 5 seconds
 * (pick another); reserved-collision is a bug shipped to users.
 */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  // ─── Currently-routed first segments — DO NOT REMOVE ───────────────
  "api", "auth", "login", "logout", "p",

  // ─── Next.js / Vercel framework internals ──────────────────────────
  "_next", "_vercel", "_static", "_error", "_app", "_document",
  "static", "assets", "public", "cdn",
  "favicon", "manifest", "sw", "service-worker",
  "robots", "sitemap", "well-known", ".well-known",
  "opengraph-image", "twitter-image", "apple-icon",
  "apple-touch-icon", "icon", "browserconfig",
  // Static asset routes Next produces from `app/<name>.ts`:
  "robots.txt", "sitemap.xml", "manifest.webmanifest",
  "favicon.ico", "favicon.png",

  // ─── Authentication & identity ─────────────────────────────────────
  "signin", "signup", "sign-in", "sign-up", "register", "registration",
  "join", "create-account", "recover", "forgot", "forgot-password",
  "reset", "reset-password", "verify", "verification", "confirm",
  "mfa", "2fa", "otp", "magic-link", "passkey", "passkeys",
  "oauth", "oauth2", "sso", "saml", "openid", "oidc",
  "callback", "callbacks", "session", "sessions", "tokens", "token",

  // ─── Account / user / membership ───────────────────────────────────
  "account", "accounts", "profile", "profiles", "me", "my",
  "user", "users", "member", "members", "people", "person",
  "identity", "identities", "avatar", "avatars",

  // ─── Org / team / workspace ────────────────────────────────────────
  "org", "orgs", "organization", "organizations",
  "workspace", "workspaces", "team", "teams",
  "group", "groups", "company", "companies",
  "tenant", "tenants",

  // ─── Settings & preferences ────────────────────────────────────────
  "settings", "setting", "preferences", "prefs", "options",
  "config", "configure", "configuration",
  "appearance", "theme", "themes", "customize", "customization",
  "notifications", "notification", "alerts", "alert",

  // ─── Billing & commerce ────────────────────────────────────────────
  "billing", "payment", "payments", "pay", "checkout",
  "subscription", "subscriptions", "subscribe", "unsubscribe",
  "plan", "plans", "pricing", "upgrade", "downgrade",
  "invoice", "invoices", "receipt", "receipts",
  "wallet", "credits", "balance", "coupon", "coupons", "promo",
  "refund", "refunds",

  // ─── Admin & ops ───────────────────────────────────────────────────
  "admin", "administration", "root", "super", "superuser",
  "owner", "sudo", "debug", "internal",

  // ─── Navigation hubs ───────────────────────────────────────────────
  "home", "dashboard", "overview", "summary", "feed", "timeline",
  "inbox", "outbox", "sent", "drafts", "draft",
  "recent", "recents", "today", "yesterday",

  // ─── Content surfaces ──────────────────────────────────────────────
  "notes", "note", "doc", "docs", "document", "documents",
  "file", "files", "folder", "folders",
  "library", "vault", "vaults",
  "archive", "archives", "trash", "deleted", "recycle", "recycled",
  "starred", "favorite", "favorites", "favourite", "favourites",
  "pinned", "bookmark", "bookmarks",

  // ─── Search / discovery ────────────────────────────────────────────
  "search", "find", "explore", "discover", "browse",

  // ─── Tags / categorisation ─────────────────────────────────────────
  "tag", "tags", "label", "labels", "category", "categories",
  "collection", "collections", "topic", "topics",

  // ─── Knowledge / graph ─────────────────────────────────────────────
  "graph", "map", "network", "links", "backlinks",
  "references", "citations", "sources",

  // ─── Tools / AI / commands ─────────────────────────────────────────
  "ai", "assistant", "chat", "tools", "tool",
  "command", "commands", "palette", "shortcuts", "keys",
  "automation", "automations", "workflow", "workflows",
  "trigger", "triggers", "action", "actions",
  "scheduled", "schedule", "cron", "jobs", "job", "queue",

  // ─── Sharing / publishing ──────────────────────────────────────────
  "share", "shared", "publish", "published", "publishing",
  "unlisted", "private", "embed", "embeds",

  // ─── Import / export / sync ────────────────────────────────────────
  "import", "imports", "export", "exports",
  "download", "downloads", "upload", "uploads",
  "sync", "syncs", "backup", "backups", "restore",

  // ─── Editor / authoring ────────────────────────────────────────────
  "editor", "edit", "write", "compose", "new", "create",

  // ─── Reader / viewer ───────────────────────────────────────────────
  "reader", "read", "view", "viewer", "preview", "previews",

  // ─── History / activity ────────────────────────────────────────────
  "history", "versions", "version", "audit", "logs", "log",
  "activity", "events", "event",
  "analytics", "stats", "statistics", "reports", "report",
  "insights", "metrics",

  // ─── Onboarding / demo ─────────────────────────────────────────────
  "onboarding", "welcome", "getting-started", "start",
  "tutorial", "tour", "intro", "introduction", "demo",
  "playground", "sandbox",
  "example", "examples", "sample", "samples",
  "template", "templates",

  // ─── Marketing pages ───────────────────────────────────────────────
  "about", "features", "feature", "product", "products",
  "solutions", "customers", "testimonials", "case-studies",
  "partners", "partner",
  "integrations", "integration", "connect", "connections",
  "apps", "app", "marketplace", "plugins", "plugin",
  "extensions", "extension",

  // ─── Support / help ────────────────────────────────────────────────
  "help", "support", "faq", "faqs", "guides", "guide",
  "documentation", "manual", "knowledge-base", "kb",
  "feedback", "contact", "community", "forum", "discussion",
  "discussions",

  // ─── Status / health ───────────────────────────────────────────────
  "status", "health", "healthz", "readyz", "livez", "ping",
  "alive", "ready", "metrics", "version", "build", "uptime",

  // ─── News / changelog ──────────────────────────────────────────────
  "blog", "posts", "post", "articles", "article", "news",
  "press", "media", "gallery", "press-kit",
  "changelog", "releases", "release", "roadmap",
  "updates", "update",

  // ─── Legal ─────────────────────────────────────────────────────────
  "legal", "terms", "tos", "terms-of-service", "terms-of-use",
  "privacy", "policy", "privacy-policy", "cookies", "cookie",
  "gdpr", "ccpa", "eula", "dmca",
  "license", "licenses", "licence", "licences",
  "copyright", "disclaimer", "imprint",

  // ─── Notifications / messaging ─────────────────────────────────────
  "notify", "messages", "message", "mail", "email", "emails",

  // ─── API meta paths (root-level mirrors of /api/*) ─────────────────
  "v1", "v2", "v3", "v4", "graphql", "rest",
  "webhook", "webhooks", "rss", "atom",

  // ─── Reserved short tokens that read as actions ────────────────────
  "go", "to", "open", "close",
  "ok", "cancel", "yes", "no",

  // ─── Brand / domain self-references ────────────────────────────────
  "sgnk", "md", "mdx", "sgnk-md", "zephyrus", "frontmatter",
]);

export class InvalidSlugError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSlugError";
  }
}

export class SlugConflictError extends Error {
  readonly conflictPath: string;
  constructor(slug: string, conflictPath: string) {
    super(`Slug "${slug}" is already used by ${conflictPath}`);
    this.name = "SlugConflictError";
    this.conflictPath = conflictPath;
  }
}

const VALID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Convenience: build the public URL for a slug. Single source of truth so
 * no caller hard-codes `/<slug>` or `/p/<slug>`; switching prefix is a
 * one-line change here.
 */
export function publicHref(slug: string): string {
  return `/${slug}`;
}

/** Returns the slug if valid; throws InvalidSlugError otherwise. */
export function validateSlug(input: string): string {
  if (typeof input !== "string") throw new InvalidSlugError("slug must be a string");
  const slug = input.trim();
  if (slug.length < SLUG_MIN_LEN) throw new InvalidSlugError("slug must not be empty");
  if (slug.length > SLUG_MAX_LEN) throw new InvalidSlugError(`slug max ${SLUG_MAX_LEN} chars`);
  if (!VALID_RE.test(slug)) throw new InvalidSlugError("slug: lowercase letters/digits/hyphens, no leading/trailing/double hyphens");
  if (RESERVED_SLUGS.has(slug)) throw new InvalidSlugError(`"${slug}" is reserved`);
  return slug;
}

/**
 * Suggests a VALID slug from a title — lowercased, hyphenated, length-capped.
 * Always returns a string that passes validateSlug:
 *   - slices to max length FIRST, then strips any hyphen the slice left dangling
 *     (so a boundary cut never yields a trailing hyphen),
 *   - falls back to "note" when the result is empty (e.g. CJK/symbol-only title)
 *     or collides with a reserved word.
 */
export function suggestSlug(title: string): string {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .slice(0, SLUG_MAX_LEN)
    .replace(/-+$/, ""); // strip trailing hyphen AFTER slicing
  if (slug.length < SLUG_MIN_LEN || RESERVED_SLUGS.has(slug)) {
    slug = "note";
  }
  return slug;
}
