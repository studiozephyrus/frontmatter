#!/usr/bin/env python3
"""Coverage of 13-SCREEN-STATE-MATRIX.md against the screen files that exist.

Reads the `## States` table of every docs/pack/12-screens/S*.md and reports, per
screen, which of the eleven states carries a row. Prints the totals the matrix
quotes. Re-run it rather than trusting a number in the prose.
"""
import glob, os, re, sys

COLS = ["first-run", "empty", "loading", "partial", "offline", "unauthorised",
        "conflict", "over-cap", "AI-unavailable", "error", "degraded"]
LOW = {c.lower(): c for c in COLS}
ALIAS = {"first run": "first-run", "firstrun": "first-run", "ai unavailable": "ai-unavailable",
         "over cap": "over-cap", "overcap": "over-cap", "unauthorized": "unauthorised",
         "no ai": "ai-unavailable"}

def states(path):
    m = re.search(r"\n## States\n(.*?)(\n## |\Z)", open(path).read(), re.S)
    got = {}
    if not m:
        return got
    for line in m.group(1).split("\n"):
        if "|" not in line:
            continue
        parts = [p.strip() for p in line.split("|")]
        key = parts[0].strip("`*").lower()
        key = ALIAS.get(key, key)
        if key not in LOW:
            continue
        rest = " ".join(parts[1:3]).lower()
        got[LOW[key]] = "n/a" if rest.startswith("n/a") else "specified"
    return got

def main():
    files = sorted(glob.glob("docs/pack/12-screens/S*.md"))
    have = {os.path.basename(f)[:-3]: states(f) for f in files}
    every = [f"S{i:02d}" for i in range(1, 39)]
    hole = spec = na = 0
    for sid in every:
        got = have.get(sid, {})
        missing = [c for c in COLS if c not in got]
        hole += len(missing)
        na += sum(1 for v in got.values() if v == "n/a")
        spec += sum(1 for v in got.values() if v == "specified")
        mark = "no file" if sid not in have else ("complete" if not missing else "missing: " + ", ".join(missing))
        print(f"{sid} {len(got)}/11 {mark}")
    absent = [s for s in every if s not in have]
    print(f"\ncells {len(every) * 11}  specified {spec}  n/a {na}  HOLE {hole}")
    print(f"screen files {len(have)} of 38, absent: {' '.join(absent) if absent else 'none'}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
