"""Apply exhibit rewrites to one area file, save, and re-verify.

usage: python3 ev-apply.py <area.json> <patch.json>

patch.json is a JSON object: { "<path>": {"old": "<exact current string>", "new": "<rewrite>"}, ... }
where <path> is the first token ev-todo.py printed, e.g. "AC1/0/rows/2/1".

Entries are applied one at a time. An entry is refused if the string at its path no longer equals
"old" exactly (stale or mistyped: never guessed). An entry is rolled back if applying it adds a
hard violation to its block: a lost citation, an altered quote or code span, a lost figure, a
shape change, or a spaced en-dash. A block that still carries an em-dash elsewhere is normal
mid-pass and is not a reason to roll back. The file is saved after every accepted entry, so a run
that is stopped part-way keeps everything accepted so far.
"""
import json, os, sys, collections

S = os.path.dirname(os.path.abspath(__file__))
REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'
from importlib import util
spec = util.spec_from_file_location('ev', f'{S}/ev-verify.py'); ev = util.module_from_spec(spec); spec.loader.exec_module(ev)


def locate(qs, path):
    qid, bi, *rest = path.split('/')
    q = next((x for x in qs if x['id'] == qid), None)
    if q is None: raise KeyError(f'no card {qid}')
    node = q['evidence'][int(bi)]
    for k in rest[:-1]:
        node = node[int(k)] if isinstance(node, list) else node[k]
    last = rest[-1]
    return node, (int(last) if isinstance(node, list) else last)


def save(fp, d):
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')


def hard(name):
    """Every hard-violation atom in the file, one per lost item, em-dash progress excluded."""
    V, *_ = ev.check_file(name)
    return collections.Counter(v for v in V if 'em-dash outside' not in v)


if __name__ == '__main__':
    name = os.path.basename(sys.argv[1]); fp = f'{REPO}/decisions/v2/{name}'
    patch = json.load(open(sys.argv[2]))
    d = json.load(open(fp))
    base = hard(name)
    applied, refused, rolled, already, blank = [], [], [], 0, 0
    for path, e in patch.items():
        if isinstance(e, dict) and e.get('new') is None:
            blank += 1; continue
        try:
            node, key = locate(d['questions'], path)
        except (KeyError, IndexError, ValueError) as x:
            refused.append((path, f'bad path: {x}')); continue
        if not isinstance(e, dict) or 'old' not in e or 'new' not in e:
            refused.append((path, 'entry must be {"old": ..., "new": ...}')); continue
        if node[key] == e['new']:
            already += 1; continue
        if node[key] != e['old']:
            refused.append((path, 'current string differs from "old"; re-run ev-todo.py')); continue
        node[key] = e['new']; save(fp, d)
        now = hard(name)
        added = now - base
        if added:
            node[key] = e['old']; save(fp, d)
            rolled.append((path, list(added)[:2]))
        else:
            applied.append(path); base = now
    print(f'applied {len(applied)}  already in place {already}  not filled in yet {blank}  refused {len(refused)}  rolled back {len(rolled)}')
    for p, r in refused: print('  REFUSED', p, '::', r)
    for p, r in rolled: print('  ROLLED BACK', p, '::', r)
    V, c, X, C = ev.check_file(name)
    dash = sum(1 for v in V if 'em-dash outside' in v)
    other = [v for v in V if 'em-dash outside' not in v]
    print(f'file now: {len(other)} hard violations, {dash} blocks still carry an em-dash, '
          f'shorthand in display {c["before_display"]}->{c["after_display"]}')
    for v in other[:10]: print('  VIOLATION', v)
