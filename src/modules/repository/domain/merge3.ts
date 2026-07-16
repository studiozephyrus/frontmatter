/**
 * Conservative line-based 3-way merge for note sync.
 *
 * Replaces the destructive "override remote" flow. When local and remote both
 * changed a note since the common base, this auto-merges the NON-overlapping
 * edits and reports a conflict (with git-style markers) only where both sides
 * touched the same base lines. Two concurrent edits that produce identical
 * text merge cleanly.
 *
 * Conservative by design: it never silently combines overlapping edits — when
 * in doubt it conflicts and lets the user decide. Correctness over cleverness;
 * a notes merge must never corrupt text. Pure domain logic, fully unit-tested.
 */

export type Merge3Result =
  | { clean: true; text: string }
  | { clean: false; text: string; conflicts: number };

export const CONFLICT_LOCAL = "<<<<<<< local";
export const CONFLICT_SEP = "=======";
export const CONFLICT_REMOTE = ">>>>>>> remote";

type Edit = { start: number; end: number; lines: string[] };

function splitLines(s: string): string[] {
  return s.split("\n");
}

function sameLines(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((x, k) => x === b[k]);
}

/**
 * Diff `base` → `other` as a list of edits: base[start,end) is replaced by
 * `lines`. Derived from an LCS so common lines are preserved as anchors.
 */
function diffRegions(base: readonly string[], other: readonly string[]): Edit[] {
  const n = base.length;
  const m = other.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] =
        base[i] === other[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }

  const edits: Edit[] = [];
  let i = 0;
  let j = 0;
  let curStart = -1;
  let curEnd = -1;
  let curLines: string[] = [];
  const flush = (): void => {
    if (curStart >= 0) {
      edits.push({ start: curStart, end: curEnd, lines: curLines });
      curStart = -1;
      curEnd = -1;
      curLines = [];
    }
  };

  while (i < n || j < m) {
    if (i < n && j < m && base[i] === other[j]) {
      flush();
      i++;
      j++;
    } else if (j >= m || (i < n && dp[i + 1]![j]! >= dp[i]![j + 1]!)) {
      // delete base[i]
      if (curStart < 0) {
        curStart = i;
        curEnd = i;
      }
      curEnd = i + 1;
      i++;
    } else {
      // insert other[j]
      if (curStart < 0) {
        curStart = i;
        curEnd = i;
      }
      curLines.push(other[j]!);
      j++;
    }
  }
  flush();
  return edits;
}

/** Reconstruct one side's text for base window [cs, ce) given that side's edits. */
function reconstructRange(
  base: readonly string[],
  edits: readonly Edit[],
  cs: number,
  ce: number,
): string[] {
  const res: string[] = [];
  let p = cs;
  for (const e of edits) {
    res.push(...base.slice(p, e.start));
    res.push(...e.lines);
    p = e.end;
  }
  res.push(...base.slice(p, ce));
  return res;
}

export function merge3(base: string, local: string, remote: string): Merge3Result {
  // Fast paths.
  if (local === remote) return { clean: true, text: local };
  if (base === local) return { clean: true, text: remote };
  if (base === remote) return { clean: true, text: local };

  const baseLines = splitLines(base);
  const localEdits = diffRegions(baseLines, splitLines(local));
  const remoteEdits = diffRegions(baseLines, splitLines(remote));

  const out: string[] = [];
  let pos = 0;
  let li = 0;
  let ri = 0;
  let conflicts = 0;

  while (li < localEdits.length || ri < remoteEdits.length) {
    const le = localEdits[li];
    const re = remoteEdits[ri];

    // Local edit is wholly before the remote edit (no shared point) → apply it.
    if (le && (!re || (le.end <= re.start && le.start !== re.start))) {
      out.push(...baseLines.slice(pos, le.start), ...le.lines);
      pos = le.end;
      li++;
      continue;
    }
    // Remote edit is wholly before the local edit → apply it.
    if (re && (!le || (re.end <= le.start && re.start !== le.start))) {
      out.push(...baseLines.slice(pos, re.start), ...re.lines);
      pos = re.end;
      ri++;
      continue;
    }

    // Overlap → build a conflict window covering all transitively-overlapping
    // edits from both sides.
    const cs = Math.min(le!.start, re!.start);
    let ce = Math.max(le!.end, re!.end);
    const liStart = li;
    const riStart = ri;
    li++;
    ri++;
    let grew = true;
    while (grew) {
      grew = false;
      while (li < localEdits.length && localEdits[li]!.start <= ce) {
        ce = Math.max(ce, localEdits[li]!.end);
        li++;
        grew = true;
      }
      while (ri < remoteEdits.length && remoteEdits[ri]!.start <= ce) {
        ce = Math.max(ce, remoteEdits[ri]!.end);
        ri++;
        grew = true;
      }
    }

    const localChunk = reconstructRange(baseLines, localEdits.slice(liStart, li), cs, ce);
    const remoteChunk = reconstructRange(baseLines, remoteEdits.slice(riStart, ri), cs, ce);

    out.push(...baseLines.slice(pos, cs));
    if (sameLines(localChunk, remoteChunk)) {
      // Both sides converged on the same text — not a real conflict.
      out.push(...localChunk);
    } else {
      out.push(CONFLICT_LOCAL, ...localChunk, CONFLICT_SEP, ...remoteChunk, CONFLICT_REMOTE);
      conflicts++;
    }
    pos = ce;
  }

  out.push(...baseLines.slice(pos));
  const text = out.join("\n");
  return conflicts > 0 ? { clean: false, text, conflicts } : { clean: true, text };
}
