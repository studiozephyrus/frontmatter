import { describe, it, expect } from "vitest";
import { findGfmTables, setTableCell } from "@/modules/preview/presentation/table-edit";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const DOC_TWO_TABLES = `# Document

Some text before.

| Name | Age |
| --- | --- |
| Alice | 30 |
| Bob | 25 |

Middle paragraph.

| Item | Price | Qty |
| ---- | ----- | --- |
| Apple | 1.00 | 5 |
| Bread | 2.50 | 2 |

End of doc.`;

// ---------------------------------------------------------------------------
// findGfmTables
// ---------------------------------------------------------------------------

describe("findGfmTables", () => {
  it("finds two tables in the fixture doc", () => {
    const tables = findGfmTables(DOC_TWO_TABLES);
    expect(tables).toHaveLength(2);
  });

  it("table 0 has the correct header row", () => {
    const tables = findGfmTables(DOC_TWO_TABLES);
    expect(tables[0]?.rows[0]).toEqual(["Name", "Age"]);
  });

  it("table 0 has two body rows", () => {
    const tables = findGfmTables(DOC_TWO_TABLES);
    expect(tables[0]?.rows).toHaveLength(3); // header + 2 body
    expect(tables[0]?.rows[1]).toEqual(["Alice", "30"]);
    expect(tables[0]?.rows[2]).toEqual(["Bob", "25"]);
  });

  it("table 1 has the correct header and body", () => {
    const tables = findGfmTables(DOC_TWO_TABLES);
    expect(tables[1]?.rows[0]).toEqual(["Item", "Price", "Qty"]);
    expect(tables[1]?.rows[1]).toEqual(["Apple", "1.00", "5"]);
    expect(tables[1]?.rows[2]).toEqual(["Bread", "2.50", "2"]);
  });

  it("assigns sequential indices", () => {
    const tables = findGfmTables(DOC_TWO_TABLES);
    expect(tables[0]?.index).toBe(0);
    expect(tables[1]?.index).toBe(1);
  });

  it("returns empty array for content with no tables", () => {
    const tables = findGfmTables("# Just a heading\n\nSome text.");
    expect(tables).toHaveLength(0);
  });

  it("does not treat a lone pipe-line without delimiter as a table", () => {
    const tables = findGfmTables("| not a | table because no delimiter |\n\nSome text.");
    expect(tables).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// setTableCell
// ---------------------------------------------------------------------------

describe("setTableCell", () => {
  it("edits table 0 header cell (rowInData=0, col=0)", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 0, 0, "Full Name");
    expect(result).toContain("| Full Name | Age |");
    // Other content preserved
    expect(result).toContain("Some text before.");
    expect(result).toContain("Middle paragraph.");
  });

  it("edits table 0 header cell (rowInData=0, col=1)", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 0, 1, "Years");
    expect(result).toContain("| Name | Years |");
  });

  it("edits table 0 body cell (rowInData=1, col=1)", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 1, 1, "31");
    expect(result).toContain("| Alice | 31 |");
    // Bob row unchanged
    expect(result).toContain("| Bob | 25 |");
  });

  it("edits table 1 body cell (rowInData=2, col=0)", () => {
    const result = setTableCell(DOC_TWO_TABLES, 1, 2, 0, "Sourdough");
    expect(result).toContain("| Sourdough | 2.50 | 2 |");
    // Apple row unchanged
    expect(result).toContain("| Apple | 1.00 | 5 |");
  });

  it("preserves delimiter rows exactly", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 0, 0, "X");
    expect(result).toContain("| --- | --- |");
  });

  it("escapes pipe characters in the new value", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 1, 0, "Alice|Bob");
    expect(result).toContain("Alice\\|Bob");
  });

  it("strips newlines in the new value", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 1, 0, "Alice\nSmith");
    // newline replaced with space
    expect(result).toContain("Alice Smith");
  });

  it("returns content unchanged for out-of-range tableIndex", () => {
    const result = setTableCell(DOC_TWO_TABLES, 99, 0, 0, "X");
    expect(result).toBe(DOC_TWO_TABLES);
  });

  it("returns content unchanged for out-of-range rowInData", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 99, 0, "X");
    expect(result).toBe(DOC_TWO_TABLES);
  });

  it("returns content unchanged for out-of-range col", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 0, 99, "X");
    expect(result).toBe(DOC_TWO_TABLES);
  });

  it("preserves content before and after tables", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 0, 0, "Changed");
    expect(result).toContain("# Document");
    expect(result).toContain("End of doc.");
  });

  it("does not corrupt table 1 when editing table 0", () => {
    const result = setTableCell(DOC_TWO_TABLES, 0, 0, 0, "Changed");
    expect(result).toContain("| Item | Price | Qty |");
    expect(result).toContain("| Apple | 1.00 | 5 |");
  });
});
