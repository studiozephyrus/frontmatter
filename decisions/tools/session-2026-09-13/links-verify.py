"""Verify the merge-note pass on decisions/v2/_links.json.

usage: python3 links-verify.py [--dump]

Hard failures: anything other than cross_area_duplicates[*].why / .agree / .map changed; a note
that still names a card id, carries an em-dash, or runs past 55 words; `map` not covering exactly
the dropped cards; a mapped letter that is not an option on the kept card; `agree` disagreeing
with the map. --dump prints every pair side by side so the mapping can be read by a person,
because whether two differently worded options are the same choice is not a regex question.
"""
import json, os, re, sys

S = os.path.dirname(os.path.abspath(__file__))
REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'
old = json.load(open(f'{S}/ev/_links.json'))
new = json.load(open(f'{REPO}/decisions/v2/_links.json'))
idx = json.load(open(f'{S}/card-index.json'))
IDS = re.compile(r'\b(?:' + '|'.join(sorted(map(re.escape, idx), key=len, reverse=True)) + r')\b')
V = []
for k in old:
    if k != 'cross_area_duplicates' and old[k] != new.get(k): V.append(f'{k} changed')
if set(new) != set(old): V.append('top-level keys changed')
od, nd = old['cross_area_duplicates'], new.get('cross_area_duplicates') or []
if len(od) != len(nd): V.append('duplicate count changed'); nd = []
agree_n = 0
for n, (a, b) in enumerate(zip(od, nd)):
    keep = a['keep']; tag = f'#{n} {keep}'
    if (a['ids'], a['keep']) != (b.get('ids'), b.get('keep')): V.append(f'{tag}: ids/keep changed'); continue
    if set(b) - {'ids', 'keep', 'why', 'agree', 'map'}: V.append(f'{tag}: unexpected keys {set(b) - {"ids","keep","why","agree","map"}}')
    w = b.get('why') or ''
    if w == a.get('why'): V.append(f'{tag}: note not rewritten')
    if IDS.search(w): V.append(f'{tag}: note names a card id {IDS.findall(w)[:3]}')
    if '—' in w: V.append(f'{tag}: em-dash in note')
    if len(w.split()) > 55: V.append(f'{tag}: note is {len(w.split())} words')
    dropped = [i for i in a['ids'] if i != keep]
    m = b.get('map')
    if not isinstance(m, dict) or set(m) != set(dropped): V.append(f'{tag}: map must cover exactly {dropped}'); continue
    opts = idx[keep]['options']
    for d_, v in m.items():
        if v is not None and v not in opts: V.append(f'{tag}: map {d_} -> {v!r} is not an option on {keep}')
    want = all(v == idx[keep]['rec'] for v in m.values())
    if b.get('agree') is not want: V.append(f'{tag}: agree={b.get("agree")!r} but the map says {want}')
    agree_n += bool(b.get('agree'))
    if '--dump' in sys.argv:
        r = idx[keep]['rec']
        print(f'\n{keep} ({idx[keep]["area"]}) recommends {r}: {opts[r]}')
        for d_ in dropped:
            dr = idx[d_]['rec']; v = m[d_]
            print(f'   {d_} ({idx[d_]["area"]}) recommended {dr}: {idx[d_]["options"][dr]}')
            print(f'      mapped to {v}: {opts.get(v, "(no equivalent here)") if v else "(no equivalent here)"}')
        print(f'   agree={b.get("agree")}  note: {w}')
print(f'links: violations {len(V)}  notes {len(nd)}  agree {agree_n}  disagree {len(nd) - agree_n}')
for v in V[:40]: print('   VIOLATION', v)
sys.exit(1 if V else 0)
