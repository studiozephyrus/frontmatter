#!/usr/bin/env python3
"""Turn fragile line citations into stable section citations.

    python3 docs/pack/tools/stabilise-citations.py [--dry]

A citation like `docs/mvp0/PRODUCT-PLAN.md:1184` is correct the day it is written and
silently wrong the next time somebody inserts a paragraph above it. That has already
happened once in this pack: the plan was edited on 18 September and every line number
below the edit moved.

`specs/SPECS.md` already bans line numbers in spec bodies for this reason. This applies
the same rule to the pack, mechanically: each cited line is resolved to the `## N. Title`
section it falls inside, and the citation is rewritten as `<file> section N`. A section
number is stable because sections are never renumbered, and a section is what a reader
actually wants anyway.

Only files with numbered `## N.` headings are converted. Everything else is left alone,
because there is nothing stable to point at.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent.parent
PACK = ROOT / 'docs' / 'pack'
DRY = '--dry' in sys.argv

# Files whose sections are numbered and stable enough to cite by number.
TARGETS = ['docs/mvp0/PRODUCT-PLAN.md', 'docs/mvp0/PRODUCT-GUIDE.md']

sections = {}      # target -> [(line_no, section_number, title)]
for t in TARGETS:
    p = ROOT / t
    if not p.exists():
        continue
    rows = []
    for i, line in enumerate(p.read_text(encoding='utf-8').split('\n'), 1):
        m = re.match(r'^## (\d+[a-z]?)\. (.+)$', line)
        if m:
            rows.append((i, m.group(1), m.group(2).strip()))
    sections[t] = rows
    print(f'{t}: {len(rows)} numbered sections')


def section_for(target, line):
    rows = sections.get(target, [])
    found = None
    for ln, num, title in rows:
        if ln <= line:
            found = (num, title)
        else:
            break
    return found


changed = converted = unresolved = 0
for f in sorted(PACK.rglob('*.md')):
    if 'tools/' in str(f.relative_to(PACK)):
        continue
    src = f.read_text(encoding='utf-8')
    out = src

    for target in TARGETS:
        esc = re.escape(target)

        def sub(m):
            global converted, unresolved
            s = section_for(target, int(m.group(1)))
            if not s:
                unresolved += 1
                return m.group(0)
            converted += 1
            return f'`{target}` section {s[0]}'

        out = re.sub(rf'`{esc}:(\d+)`', sub, out)

    # A bare `:NNN` is a legitimate continuation of the citation before it, as in
    # `file.ts:56` to `:58`. But once the citation before it became a SECTION reference,
    # the line number has no file attached and points at nothing. Convert those too.
    def orphan(m):
        global converted
        before = out[max(0, m.start() - 200):m.start()]
        sec = list(re.finditer(r'`(' + '|'.join(re.escape(x) for x in TARGETS) + r')` section', before))
        fil = list(re.finditer(r'`[\w./-]+\.(?:md|ts|tsx|mjs|py|json)(?::\d+)?`', before))
        if not sec or (fil and fil[-1].start() > sec[-1].start()):
            return m.group(0)
        s = section_for(sec[-1].group(1), int(m.group(1)))
        if not s:
            return m.group(0)
        converted += 1
        return f'section {s[0]}'

    out = re.sub(r'`:(\d+)`', orphan, out)

    if out != src:
        changed += 1
        if not DRY:
            f.write_text(out, encoding='utf-8')

print(f'files changed: {changed}')
print(f'citations converted to a section: {converted}')
print(f'citations left alone, no section above them: {unresolved}')
print('now run: python3 docs/pack/tools/validate-pack.py')
