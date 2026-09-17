/**
 * Placeholder for the four public legal and commercial pages: privacy, terms,
 * pricing, refunds. The texts are pending (plan v5, the legal section, owner
 * Sagnik). Until they land, a stranger sees what the page will hold and the
 * date it is due, instead of a sign-in wall.
 */
const DUE = "15 October 2026";

export function PendingLegalPage({ title, summary }: { title: string; summary: string }) {
  return (
    <main
      style={{
        maxWidth: "62ch",
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "var(--font-sans)",
        color: "var(--fg)",
        lineHeight: 1.6,
      }}
    >
      <p style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
        frontmatter
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 650, letterSpacing: "-.02em", margin: "6px 0 12px" }}>{title}</h1>
      <p style={{ fontSize: 15, margin: "0 0 18px" }}>{summary}</p>
      <p style={{ fontSize: 14, color: "var(--fg-muted)", margin: 0 }}>
        This text is being written and is due by {DUE}. Until then, write to studiozephyrus@gmail.com with any
        question about your data or a published page, and it will be answered within twenty-four hours.
      </p>
    </main>
  );
}
