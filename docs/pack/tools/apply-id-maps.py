#!/usr/bin/env python3
"""Rewrite the ids cited in the 38 screen specs from the reconcilers' maps, in one pass per file.

    python3 docs/pack/tools/apply-id-maps.py            # dry run: counts, and every gap
    python3 docs/pack/tools/apply-id-maps.py --write    # rewrite, saving after each file

Why one script and not the reconcilers themselves: four reconcilers ran at once, each owning one
register. Letting each also edit the screens would have had four writers racing on the same 38
files, which is how the ids came to disagree in the first place.

Each map is `{"S04": {"E048": "E026", "E080": "E080"}}` and must be total over its kind: every id
of that kind in a screen needs an entry, identity included. A missing entry is refused rather than
left alone, because an unmapped id is exactly the defect this repairs. All kinds are substituted in
a single regex pass per file, so `E048 -> E026` can never then be caught by a second rule for `E026`.
"""
import json
import pathlib
import re
import sys

PACK = pathlib.Path(__file__).resolve().parent.parent
TOOLS = PACK / 'tools'
KINDS = {
    'E': ('error-map.json', r'E\d{3}'),
    'C': ('component-map.json', r'C\d{3}'),
    'A': ('acceptance-map.json', r'A\d{3}'),
}


def main():
    write = '--write' in sys.argv
    maps = {}
    for kind, (name, _) in KINDS.items():
        p = TOOLS / name
        if p.exists():
            maps[kind] = json.loads(p.read_text(encoding='utf-8'))
        else:
            print(f'  {name} not present, {kind} ids left as they are')
    if not maps:
        sys.exit('no maps found')

    pat = re.compile(r'\b(' + '|'.join(KINDS[k][1] for k in maps) + r')\b')
    gaps, changed, total = [], 0, 0
    plans = {}
    for f in sorted((PACK / '12-screens').glob('S*.md')):
        sid = f.stem
        text = f.read_text(encoding='utf-8')
        n = 0

        def sub(m):
            nonlocal n
            tok = m.group(1)
            table = maps[tok[0]].get(sid, {})
            if tok not in table:
                gaps.append(f'{sid}: {tok} has no entry in {KINDS[tok[0]][0]}')
                return tok
            # null means the id appears only inside the screen's id-scheme note, which is rewritten
            # by hand once the maps land. It stays as it is, so the validator keeps flagging that
            # note until somebody does.
            if table[tok] is None:
                return tok
            if table[tok] != tok:
                n += 1
            return table[tok]

        new = pat.sub(sub, text)
        total += n
        if new != text:
            changed += 1
            plans[f] = new

    print(f'{total} ids to rewrite across {changed} screen files')
    for g in gaps[:40]:
        print('  GAP', g)
    if gaps:
        print(f'{len(gaps)} gap(s). Refusing to write until every id is mapped.')
        sys.exit(1)
    if write:
        for f, new in plans.items():
            f.write_text(new, encoding='utf-8')
        print(f'wrote {len(plans)} files')


if __name__ == '__main__':
    main()
