/**
 * Pure helpers for locating and editing GFM pipe-table blocks within markdown source.
 *
 * GFM pipe table anatomy:
 *   | Header A | Header B |   ← header row
 *   | -------- | -------- |   ← delimiter row (must match header column count)
 *   | Cell 1   | Cell 2   |   ← body rows (zero or more)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GfmTable {
  /** 0-based order of this table within the document. */
  index: number;
  /** 1-based line number of the header row. */
  startLine: number;
  /** 1-based line number of the last body row (or delimiter row if no body). */
  endLine: number;
  /**
   * All data rows in order: rows[0] = header, rows[1..N] = body.
   * Each inner string[] contains the trimmed cell text (pipe-characters stripped).
   */
  rows: string[][];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Return true if a line looks like a GFM alignment/delimiter row. */
function isDelimiterRow(line: string): boolean {
  // Must have at least one | somewhere
  if (!line.includes("|")) return false;
  // Strip leading/trailing pipes and whitespace, split on |
  const trimmed = line.trim();
  const inner = trimmed.startsWith("|") ? trimmed.slice(1) : trimmed;
  const stripped = inner.endsWith("|") ? inner.slice(0, -1) : inner;
  const cells = stripped.split("|");
  // Every cell must match /^\s*:?-+:?\s*$/
  return cells.every((c) => /^\s*:?-+:?\s*$/.test(c));
}

/** Parse a pipe-table row into an array of trimmed cell strings. */
function parsePipeRow(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.startsWith("|") ? trimmed.slice(1) : trimmed;
  const stripped = inner.endsWith("|") ? inner.slice(0, -1) : inner;
  return stripped.split("|").map((c) => c.trim());
}

/** Escape pipe characters and strip newlines in a cell value before writing back. */
function escapeCellValue(value: string): string {
  // Strip newlines (GFM cells are single-line)
  return value.replace(/\r?\n/g, " ").replace(/\|/g, "\\|");
}

/** Serialize a single pipe-table row from an array of cell strings. */
function serializePipeRow(cells: string[]): string {
  return `| ${cells.join(" | ")} |`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Locate all GFM pipe-table blocks in `content` and return their metadata.
 *
 * A GFM table requires:
 *   1. A header row (contains `|`)
 *   2. Immediately followed by a delimiter row (cells match `:?-+:?`)
 *   3. Optionally followed by body rows (contain `|`)
 *
 * Lines are 1-based to match editor conventions.
 */
export function findGfmTables(content: string): GfmTable[] {
  const lines = content.split("\n");
  const tables: GfmTable[] = [];
  let tableIdx = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    // Potential header: must contain `|` and NOT be a delimiter row
    if (line.includes("|") && !isDelimiterRow(line)) {
      const nextLine = lines[i + 1] ?? "";
      if (isDelimiterRow(nextLine)) {
        // Found a GFM table header at line i
        const headerRow = parsePipeRow(line);
        const startLine = i + 1; // 1-based

        // Collect body rows
        const bodyRows: string[][] = [];
        let j = i + 2; // skip header + delimiter
        while (j < lines.length) {
          const bodyLine = lines[j] ?? "";
          // Body ends at first line that doesn't look like a pipe row
          if (!bodyLine.includes("|")) break;
          bodyRows.push(parsePipeRow(bodyLine));
          j++;
        }

        const endLine = j - 1 + 1; // j-1 is last consumed 0-based index, +1 for 1-based
        // If no body rows, endLine = delimiter line (i+2 in 1-based = i+1+1)
        const actualEndLine =
          bodyRows.length > 0 ? endLine : i + 2;

        tables.push({
          index: tableIdx++,
          startLine,
          endLine: actualEndLine,
          rows: [headerRow, ...bodyRows],
        });

        // Advance past this table
        i = j;
        continue;
      }
    }

    i++;
  }

  return tables;
}

/**
 * Return a new copy of `content` with the specified cell updated.
 *
 * @param content    - Full markdown source string.
 * @param tableIndex - 0-based table index (from findGfmTables).
 * @param rowInData  - 0 = header row, 1..N = body rows.
 * @param col        - 0-based column index.
 * @param value      - New cell value (pipe chars and newlines will be escaped).
 *
 * Returns `content` unchanged if any index is out of range or if the table is
 * not a standard GFM pipe table.
 */
export function setTableCell(
  content: string,
  tableIndex: number,
  rowInData: number,
  col: number,
  value: string,
): string {
  const tables = findGfmTables(content);
  const table = tables[tableIndex];
  if (!table) return content;

  const targetRow = table.rows[rowInData];
  if (!targetRow) return content;
  if (col < 0 || col >= targetRow.length) return content;

  // Build the updated rows (data rows: header + body)
  const newRows = table.rows.map((row, rIdx) => {
    if (rIdx !== rowInData) return row;
    return row.map((cell, cIdx) =>
      cIdx === col ? escapeCellValue(value) : cell,
    );
  });

  // Re-derive the delimiter row from the original content
  const lines = content.split("\n");
  // delimiter is at (startLine - 1) + 1  (0-based: startLine)
  const delimLineIndex = table.startLine; // 0-based index of delimiter row
  const delimLine = lines[delimLineIndex] ?? "";

  // Build replacement lines: header + delimiter + body rows
  const headerLine = serializePipeRow(newRows[0] ?? []);
  const bodyLines = newRows.slice(1).map((row) => serializePipeRow(row));
  const tableLines = [headerLine, delimLine, ...bodyLines];

  // Replace the original table lines in the content
  // startLine is 1-based → 0-based index = startLine - 1 (header)
  const headerIdx = table.startLine - 1;
  // endLine is 1-based
  const endIdx = table.endLine - 1;
  const totalTableLines = endIdx - headerIdx + 1;

  const newLinesArr = [
    ...lines.slice(0, headerIdx),
    ...tableLines,
    ...lines.slice(headerIdx + totalTableLines),
  ];

  return newLinesArr.join("\n");
}
