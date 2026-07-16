export const DISALLOWED_RAW_HTML_ELEMENTS = [
  "base",
  "button",
  "embed",
  "form",
  "iframe",
  "link",
  "meta",
  "object",
  "script",
  "select",
  "style",
  "textarea",
] as const;

const SAFE_HTML_ELEMENTS = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "u",
  "ul",
  "var",
]);

const DISALLOWED_RAW_HTML_ELEMENT_SET = new Set<string>(DISALLOWED_RAW_HTML_ELEMENTS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function getOffset(node: unknown, key: "start" | "end"): number | undefined {
  if (!isRecord(node)) return undefined;
  const position = node["position"];
  if (!isRecord(position)) return undefined;
  const point = position[key];
  if (!isRecord(point)) return undefined;
  const offset = point["offset"];
  return typeof offset === "number" ? offset : undefined;
}

function getTextContent(node: unknown): string {
  if (!isRecord(node)) return "";
  if (node["type"] === "text") {
    const value = node["value"];
    return typeof value === "string" ? value : "";
  }
  const children = node["children"];
  if (!Array.isArray(children)) return "";
  return children.map(getTextContent).join("");
}

function literalSourceForNode(source: string, node: unknown): string | undefined {
  const start = getOffset(node, "start");
  const end = getOffset(node, "end");
  if (start === undefined || end === undefined || start < 0 || end < start) return undefined;
  return source.slice(start, end);
}

// URL-bearing attributes that must be checked for `javascript:` / `data:`
// schemes. SVG `xlink:href` is the historical cousin of `href` and accepts the
// same protocols, so it's policed identically.
const URL_ATTRS = new Set(["href", "src", "xlink:href", "action", "formaction", "poster", "background", "ping", "cite", "data"]);

// `safe` URL schemes for those URL-bearing attributes. Anything else gets
// dropped — including `javascript:`, `vbscript:`, and inline `data:text/html`.
// We deliberately allow `data:image/*` and `mailto:` so that legitimate inline
// images and email links keep working.
function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === "") return true; // empty href is harmless
  // Relative / fragment URLs are always safe.
  if (trimmed.startsWith("#") || trimmed.startsWith("/") || trimmed.startsWith("?") || trimmed.startsWith(".")) {
    return true;
  }
  // Check the scheme. Allow http(s), mailto, tel and image data URIs.
  const colonIdx = trimmed.indexOf(":");
  if (colonIdx === -1) return true; // path-only, no scheme
  // Bail on whitespace/control chars before the colon — attackers wrap
  // `javascript:` with newlines (`java\nscript:`) to bypass naive checks.
  // eslint-disable-next-line no-control-regex
  const scheme = trimmed.slice(0, colonIdx).replace(/[\s\u0000-\u001f]/g, "").toLowerCase();
  if (scheme === "http" || scheme === "https" || scheme === "mailto" || scheme === "tel") return true;
  if (scheme === "data" && /^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i.test(trimmed)) return true;
  return false;
}

/** Strip inline event handlers and dangerous URL schemes from a hast element's
 *  `properties` map. rehype-raw passes user-written HTML through verbatim, so
 *  this is the only line of defence against `<img onerror>` / `<a href=javascript:>` */
function sanitizeProperties(element: Record<string, unknown>): void {
  const props = element["properties"];
  if (!isRecord(props)) return;
  for (const key of Object.keys(props)) {
    const lowerKey = key.toLowerCase();
    // Strip every event handler — `onclick`, `onload`, `onerror`, `onfocus`…
    // hast uses camelCase (`onClick`), but rehype-raw normalises to lowercase
    // on input; cover both forms.
    if (lowerKey.startsWith("on")) {
      delete props[key];
      continue;
    }
    if (URL_ATTRS.has(lowerKey)) {
      const v = props[key];
      if (typeof v === "string" && !isSafeUrl(v)) {
        delete props[key];
      }
    }
  }
}

function scrubHtmlNode(source: string, node: unknown): void {
  if (!isRecord(node)) return;
  const children = node["children"];
  if (!Array.isArray(children)) return;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (!isRecord(child)) continue;

    if (child["type"] === "element") {
      const rawTagName = child["tagName"];
      const tagName = typeof rawTagName === "string" ? rawTagName.toLowerCase() : "";
      if (DISALLOWED_RAW_HTML_ELEMENT_SET.has(tagName)) {
        children.splice(i, 1);
        i--;
        continue;
      }
      if (tagName !== "" && !SAFE_HTML_ELEMENTS.has(tagName)) {
        const literal = literalSourceForNode(source, child) ?? `<${tagName}>${getTextContent(child)}</${tagName}>`;
        children.splice(i, 1, { type: "text", value: literal });
        continue;
      }
      // Allowed element — still strip event handlers + unsafe URL schemes
      // before recursing into children.
      sanitizeProperties(child);
    }

    scrubHtmlNode(source, child);
  }
}

export function createRehypeHtmlPolicy(source: string) {
  return function rehypeHtmlPolicy() {
    return function transform(tree: unknown): void {
      scrubHtmlNode(source, tree);
    };
  };
}

export function getAnchorTargetProps(url: string):
  | { target: "_blank"; rel: "noopener noreferrer" }
  | undefined {
  const isInternal =
    url.startsWith("#") ||
    url.startsWith("/") ||
    url.startsWith("?") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:");
  return isInternal ? undefined : { target: "_blank", rel: "noopener noreferrer" };
}
