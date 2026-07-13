const checks = [
  "GitHub repo connected",
  "Vercel production deployment ready",
  "Cloudflare custom domain active",
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">frontmatter</p>
        <h1>Hello frontmatter.</h1>
        <p className="lede">
          This project was created by GVC: GitHub, Vercel, and Cloudflare wired
          from one project name.
        </p>
        <div className="checks">
          {checks.map((check) => (
            <div key={check} className="check">
              {check}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
