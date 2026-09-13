"""List only the exhibit strings in one area file that still need work.

usage: python3 ev-todo.py <area.json>

A string needs work if it has an em-dash outside "quotes" and `code`, or internal shorthand
(card ids, MVP-0, sidecar, F-numbers, screen codes, Exhibit N, section numbers, ...) in display
text. Citation slots (items[i][2], and table columns headed Source/Where/Line/Location/Citation/
Document/Section) are listed only for em-dashes; the citation itself stays.

Output, one entry per string, grouped by card and block for context:
    == AC1  <the card question>
    -- AC1/0  block title: <title>
    AC1/0/rows/2/1 [display] <the string>
The first token of each entry line is the PATH that ev-apply.py takes.
"""
import json, os, re, sys

S = os.path.dirname(os.path.abspath(__file__))
REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'
sys.path.insert(0, S)
from importlib import util
spec = util.spec_from_file_location('ev', f'{S}/ev-verify.py'); ev = util.module_from_spec(spec); spec.loader.exec_module(ev)


def needs(s, cite):
    outside = ev.CODE.sub(' ', ev.QUOTE.sub(' ', s))
    dash = '—' in outside
    short = [h for h in ev.SHOW.findall(ev.strip_protected(s)) if h not in ev.KEEP_SHOW]
    return dash or (short and not cite), short


def walk(b):
    """(path-suffix, string, is_citation_slot) for every rendered string in a block."""
    for k in ('title', 'note', 'unit', 'thresholdLabel'):
        if isinstance(b.get(k), str): yield k, b[k], False
    cols = b.get('cols') or []
    for i, c in enumerate(cols):
        if isinstance(c, str): yield f'cols/{i}', c, False
    cite_idx = {i for i, c in enumerate(cols) if isinstance(c, str) and ev.CITE_COLS.match(c.strip())}
    for r, row in enumerate(b.get('rows') or []):
        for i, c in enumerate(row):
            if isinstance(c, str): yield f'rows/{r}/{i}', c, i in cite_idx
    for r, it in enumerate(b.get('items') or []):
        for i, c in enumerate(it):
            if isinstance(c, str): yield f'items/{r}/{i}', c, i == 2
    for r, d in enumerate(b.get('data') or []):
        if d and isinstance(d[0], str): yield f'data/{r}/0', d[0], False


if __name__ == '__main__':
    name = os.path.basename(sys.argv[1])
    qs = json.load(open(f'{REPO}/decisions/v2/{name}'))['questions']
    out = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None
    todo = {}
    n = 0
    for q in qs:
        head = False
        for bi, b in enumerate(q.get('evidence') or []):
            shown = False
            for suf, s, cite in walk(b):
                need, short = needs(s, cite)
                if not need: continue
                if not head: print(f'\n== {q["id"]}  {q["q"]}'); head = True
                if not shown: print(f'-- {q["id"]}/{bi}  block title: {b.get("title", "")}'); shown = True
                tag = 'cite-slot' if cite else 'display'
                print(f'{q["id"]}/{bi}/{suf} [{tag}]{" shorthand=" + ",".join(short) if short and not cite else ""} {s}')
                todo[f'{q["id"]}/{bi}/{suf}'] = {'old': s, 'new': None, 'slot': tag, 'shorthand': short if not cite else []}
                n += 1
    if out:
        json.dump(todo, open(out, 'w'), ensure_ascii=False, indent=1)
        print(f'wrote {out}: fill in "new" for each path, then run ev-apply.py {name} {out}')
    print(f'\n{n} strings need work in {name}')
