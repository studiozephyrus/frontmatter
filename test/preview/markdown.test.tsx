// @vitest-environment jsdom

import { StrictMode } from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Markdown } from "@/modules/preview/presentation/Markdown";

const CONTENT = `# Hi

- [x] done
- [ ] todo

| a | b |
|---|---|
| 1 | 2 |

> [!note] Heads up
> body

\`code\``;

describe("Markdown component", () => {
  it("renders without crashing", () => {
    render(<Markdown content={CONTENT} />);
  });

  it("renders an h1 with 'Hi'", () => {
    render(<Markdown content={CONTENT} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Hi");
  });

  it("renders a checked checkbox for [x] task item", () => {
    render(<Markdown content={CONTENT} />);
    const checkboxes = screen.getAllByRole("checkbox");
    const checked = checkboxes.find((cb) => (cb as HTMLInputElement).checked);
    expect(checked).toBeDefined();
  });

  it("renders an unchecked checkbox for [ ] task item", () => {
    render(<Markdown content={CONTENT} />);
    const checkboxes = screen.getAllByRole("checkbox");
    const unchecked = checkboxes.find((cb) => !(cb as HTMLInputElement).checked);
    expect(unchecked).toBeDefined();
  });

  it("renders a table", () => {
    render(<Markdown content={CONTENT} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders raw inline HTML tags and markdown links instead of literal source", () => {
    const content = `> <strong>Navigation (<a href="https://md.sgnk.ai" target="_blank" rel="noopener">md.sgnk.ai</a>):</strong> click <strong>[Table of contents](#table-of-contents)</strong>.`;

    const { container } = render(<Markdown content={content} />);

    expect(container).not.toHaveTextContent("<strong>");
    expect(container.querySelector("strong")).toHaveTextContent("Navigation");
    expect(screen.getByRole("link", { name: "md.sgnk.ai" })).toHaveAttribute(
      "href",
      "https://md.sgnk.ai",
    );
    expect(screen.getByRole("link", { name: "Table of contents" })).toHaveAttribute(
      "href",
      "#table-of-contents",
    );
    expect(container.querySelector("[node]")).toBeNull();
  });

  it("keeps editable table data matched to its source table under StrictMode", () => {
    const content = `## First

| Key | Value |
|---|---|
| Alpha | One |

## Second

| Key | Value |
|---|---|
| Beta | Two |`;

    const { container } = render(
      <StrictMode>
        <Markdown content={content} onEdit={vi.fn()} />
      </StrictMode>,
    );

    const tables = Array.from(container.querySelectorAll("table"));
    expect(tables).toHaveLength(2);
    expect(tables[0]).toHaveTextContent("Alpha");
    expect(tables[0]).not.toHaveTextContent("Beta");
    expect(tables[1]).toHaveTextContent("Beta");
    expect(tables[1]).not.toHaveTextContent("Alpha");
  });

  it("renders table cell markdown and raw HTML as formatted content", () => {
    const content = `| § | Section |
|---|---|
| 0 | <strong>[0. How to read this document](#0-how-to-read-this-document)</strong> |`;

    const { container } = render(<Markdown content={content} />);

    expect(container).not.toHaveTextContent("<strong>");
    const link = screen.getByRole("link", { name: "0. How to read this document" });
    expect(link).toHaveAttribute("href", "#0-how-to-read-this-document");
    expect(link.closest("strong")).not.toBeNull();
    expect(container.querySelector("[node]")).toBeNull();
  });

  it("does not enter table edit mode on normal link clicks", () => {
    const content = `| § | Section |
|---|---|
| 0 | <strong>[0. How to read this document](#0-how-to-read-this-document)</strong> |`;

    const { container } = render(<Markdown content={content} onEdit={vi.fn()} />);
    const link = screen.getByRole("link", { name: "0. How to read this document" });

    fireEvent.click(link);

    expect(container.querySelector("input")).toBeNull();
    expect(link).toHaveAttribute("href", "#0-how-to-read-this-document");
  });

  it("keeps unknown placeholder tags as literal text", () => {
    const content = "Route path: src/app/tools/<slug>";

    const { container } = render(<Markdown content={content} />);

    expect(container).toHaveTextContent("src/app/tools/<slug>");
    expect(container.querySelector("slug")).toBeNull();
  });

  it("keeps unknown placeholder tags as literal text inside table cells", () => {
    const content = `| Field | Detail |
|---|---|
| Architecture | Single Next app under src/app/tools/<slug>; shared shell |`;

    const { container } = render(<Markdown content={content} onEdit={vi.fn()} />);

    expect(container).toHaveTextContent("src/app/tools/<slug>; shared shell");
    expect(container.querySelector("slug")).toBeNull();
  });

  it("drops active raw HTML elements", () => {
    const { container } = render(<Markdown content={'Before<script>alert("x")</script>After'} />);

    expect(container.querySelector("script")).toBeNull();
    expect(container).not.toHaveTextContent("alert");
    expect(container).toHaveTextContent("Before");
    expect(container).toHaveTextContent("After");
  });

  it("renders the callout with 'Heads up' text", () => {
    render(<Markdown content={CONTENT} />);
    expect(screen.getByText(/Heads up/i)).toBeInTheDocument();
  });

  it("renders single newlines as hard line breaks (Obsidian-style soft breaks)", () => {
    // Three consecutive lines with NO blank line between them. Plain
    // CommonMark collapses these into one paragraph (joined by spaces);
    // remark-breaks turns each newline into a <br> so the lines stay
    // visually separate, matching Obsidian's default.
    const { container } = render(
      <Markdown content={"Sagnik Mitra\nFounder, Zephyrus\nzephyrus.studio"} />,
    );
    const paragraph = container.querySelector("p");
    expect(paragraph).not.toBeNull();
    // Two newlines → two <br> elements inside the single paragraph.
    expect(paragraph?.querySelectorAll("br").length).toBe(2);
  });
});
