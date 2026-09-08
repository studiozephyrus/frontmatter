"""Find declarations inside a @media block that a LATER base rule at the same
specificity silently overrides. That is the defect that killed the phone action
bar: source order decides, and the base rule was written below its own override."""
import re
import sys
import pathlib

css = pathlib.Path(sys.argv[1]).read_text()

# Walk the file tracking @media depth, recording (selector, property, line, in_media).
decls = []
depth = 0
media_depth = None
line_no = 0
buf = ""
sel = None
for raw in css.split("\n"):
    line_no += 1
    stripped = raw.strip()
    if stripped.startswith("@media"):
        media_depth = depth
        depth += stripped.count("{") - stripped.count("}")
        continue
    opens = raw.count("{")
    closes = raw.count("}")
    if opens:
        head = raw.split("{")[0].strip()
        if head:
            sel = head
        body = raw.split("{", 1)[1]
        for prop in re.findall(r"([a-z-]+)\s*:", body.split("}")[0]):
            decls.append((sel, prop, line_no, media_depth is not None))
    elif sel and ":" in raw and not stripped.startswith(("/*", "*", "@")):
        for prop in re.findall(r"^\s*([a-z-]+)\s*:", raw):
            decls.append((sel, prop, line_no, media_depth is not None))
    depth += opens - closes
    if media_depth is not None and depth <= media_depth:
        media_depth = None

# A media declaration is dead when the SAME selector+property appears in a base
# rule at a LATER line.
base = {}
for s, p, ln, in_media in decls:
    if not in_media:
        base.setdefault((s, p), []).append(ln)

dead = []
for s, p, ln, in_media in decls:
    if in_media:
        later = [b for b in base.get((s, p), []) if b > ln]
        if later:
            dead.append((s, p, ln, later[0]))

if not dead:
    print("clean — no media declaration is overridden by a later base rule")
else:
    print(f"{len(dead)} dead media declaration(s):")
    for s, p, ln, b in dead:
        print(f"  {s} {{{p}}} at line {ln} is overridden by the base rule at line {b}")
    sys.exit(1)
