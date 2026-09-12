import { describe, it, expect } from "vitest";
import { groupForTags, buildGraph, COLORS } from "@/modules/graph/presentation/graph-data";
import type { NoteMeta } from "@/modules/vault/application/dto";

// ---------------------------------------------------------------------------
// groupForTags
// ---------------------------------------------------------------------------

describe("groupForTags", () => {
  it("returns moc for tag 'moc'", () => {
    expect(groupForTags(["moc"])).toBe("moc");
  });

  it("returns project for tag 'project/hq'", () => {
    expect(groupForTags(["project/hq"])).toBe("project");
  });

  it("returns course for tag 'course/ml101'", () => {
    expect(groupForTags(["course/ml101"])).toBe("course");
  });

  it("returns research for tag 'research/papers'", () => {
    expect(groupForTags(["research/papers"])).toBe("research");
  });

  it("returns markets for tag 'markets'", () => {
    expect(groupForTags(["markets"])).toBe("markets");
  });

  it("returns prompts for tag 'prompts'", () => {
    expect(groupForTags(["prompts"])).toBe("prompts");
  });

  it("returns marketing for tag 'marketing'", () => {
    expect(groupForTags(["marketing"])).toBe("marketing");
  });

  it("returns qa for tag 'qa'", () => {
    expect(groupForTags(["qa"])).toBe("qa");
  });

  it("returns default for unknown tags", () => {
    expect(groupForTags(["random", "stuff"])).toBe("default");
  });

  it("returns default for empty tags", () => {
    expect(groupForTags([])).toBe("default");
  });

  it("moc wins over project in priority", () => {
    expect(groupForTags(["project/hq", "moc"])).toBe("moc");
  });

  it("project wins over course in priority", () => {
    expect(groupForTags(["course/x", "project/y"])).toBe("project");
  });
});

// ---------------------------------------------------------------------------
// buildGraph
// ---------------------------------------------------------------------------

const makeNote = (overrides: Partial<NoteMeta> & { path: string }): NoteMeta => ({
  title: overrides.path.split("/").pop()?.replace(".md", "") ?? overrides.path,
  tags: [],
  outbound: [],
  backlinks: [],
  excludeFromGraph: false,
  ...overrides,
});

describe("buildGraph", () => {
  it("excludes notes with excludeFromGraph === true (_Archive)", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "_Archive/OldNote.md", excludeFromGraph: true }),
      makeNote({ path: "Projects/Note.md" }),
    ];
    const { nodes } = buildGraph(notes);
    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.id).toBe("Projects/Note.md");
  });

  it("creates a node for each included note", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "a.md", title: "A", tags: ["moc"] }),
      makeNote({ path: "b.md", title: "B", tags: ["project/x"] }),
    ];
    const { nodes } = buildGraph(notes);
    expect(nodes).toHaveLength(2);
    const nodeA = nodes.find((n) => n.id === "a.md");
    expect(nodeA?.group).toBe("moc");
    expect(nodeA?.color).toBe(COLORS.moc);
    expect(nodeA?.label).toBe("A");
  });

  it("resolves an outbound basename to a link", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Projects/Alpha.md", outbound: ["Beta"] }),
      makeNote({ path: "Projects/Beta.md" }),
    ];
    const { links } = buildGraph(notes);
    expect(links).toHaveLength(1);
    expect(links[0]).toEqual({ source: "Projects/Alpha.md", target: "Projects/Beta.md" });
  });

  it("drops unresolved outbound links", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["NonExistent"] }),
    ];
    const { links } = buildGraph(notes);
    expect(links).toHaveLength(0);
  });

  it("reports an unresolved outbound link instead of silently dropping it", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["NonExistent"] }),
    ];
    const { links, unresolved } = buildGraph(notes);
    expect(links).toHaveLength(0);
    expect(unresolved).toEqual([
      { source: "Alpha.md", target: "NonExistent", reason: "no-such-note" },
    ]);
  });

  it("drops links to excluded notes", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["Beta"] }),
      makeNote({ path: "Beta.md", excludeFromGraph: true }),
    ];
    const { links } = buildGraph(notes);
    expect(links).toHaveLength(0);
  });

  it("reports a link to an excluded note with its own reason", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["Beta"] }),
      makeNote({ path: "Beta.md", excludeFromGraph: true }),
    ];
    const { unresolved } = buildGraph(notes);
    expect(unresolved).toEqual([
      { source: "Alpha.md", target: "Beta", reason: "target-excluded" },
    ]);
  });

  it("deduplicates repeated unresolved links", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["Ghost", "Ghost"] }),
    ];
    const { unresolved } = buildGraph(notes);
    expect(unresolved).toHaveLength(1);
  });

  it("reports nothing unresolved when every link resolves", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["Beta"] }),
      makeNote({ path: "Beta.md" }),
    ];
    const { unresolved } = buildGraph(notes);
    expect(unresolved).toEqual([]);
  });

  it("does not report a self-link as unresolved", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["Alpha"] }),
    ];
    const { links, unresolved } = buildGraph(notes);
    expect(links).toHaveLength(0);
    expect(unresolved).toEqual([]);
  });

  it("deduplicates links", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["Beta", "Beta"] }),
      makeNote({ path: "Beta.md" }),
    ];
    const { links } = buildGraph(notes);
    expect(links).toHaveLength(1);
  });

  it("drops self-links", () => {
    const notes: NoteMeta[] = [
      makeNote({ path: "Alpha.md", outbound: ["Alpha"] }),
    ];
    const { links } = buildGraph(notes);
    expect(links).toHaveLength(0);
  });
});
