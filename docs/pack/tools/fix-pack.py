#!/usr/bin/env python3
"""Apply the mechanical fixes the pack validator asks for.

    python3 docs/pack/tools/fix-pack.py [--dry]

It fixes only what has one right answer:
  - em and en dashes become plain hyphens
  - a citation naming a file that exists in exactly one place gets its full path

It deliberately does NOT fix a "one fact, one home" collision. Deciding which of two
files owns an id is a judgement about what each file is for, and a script that guessed
would quietly make the wrong one authoritative. Those get printed for a person.

Run validate-pack.py afterwards. This tool never claims success on its own.
"""
import pathlib
import re
import sys

PACK = pathlib.Path(__file__).resolve().parent.parent
ROOT = PACK.parent.parent
DRY = '--dry' in sys.argv
SKIP = {'node_modules', '.next', '.git', 'out', 'dist', 'target', 'coverage'}


def index_by_name():
    idx, stack = {}, [ROOT]
    while stack:
        d = stack.pop()
        try:
            entries = list(d.iterdir())
        except OSError:
            continue
        for e in entries:
            if e.name in SKIP or (e.name.startswith('.') and e.is_dir()):
                continue
            if e.is_dir():
                stack.append(e)
            else:
                idx.setdefault(e.name, []).append(e)
    return idx


BY_NAME = index_by_name()
dashes = cites = 0

for f in sorted(PACK.rglob('*.md')):
    if 'tools/' in str(f.relative_to(PACK)):
        continue
    src = f.read_text(encoding='utf-8')
    out = src

    n = out.count('—') + out.count('–')
    if n:
        out = out.replace('—', '-').replace('–', '-')
        dashes += n

    def fix(m):
        global cites
        ref, line = m.group(1), m.group(2)
        if (ROOT / ref).exists():
            return m.group(0)
        hits = (BY_NAME.get(ref, []) if '/' not in ref
                else [h for h in BY_NAME.get(ref.rsplit('/', 1)[-1], [])
                      if str(h).endswith('/' + ref)])
        if len(hits) == 1:
            cites += 1
            return f'`{hits[0].relative_to(ROOT)}:{line}`'
        return m.group(0)

    out = re.sub(r'`([\w./-]+\.(?:md|ts|tsx|mjs|py|json)):(\d+)`', fix, out)

    if out != src and not DRY:
        f.write_text(out, encoding='utf-8')

print(f'dashes replaced: {dashes}')
print(f'citations given a full path: {cites}')
print('now run: python3 docs/pack/tools/validate-pack.py')
