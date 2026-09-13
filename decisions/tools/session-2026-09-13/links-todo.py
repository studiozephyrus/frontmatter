"""Print every merge note with both cards' options, so the mapping can be judged without opening
the fifteen area files.

usage: python3 links-todo.py [--from N] [--to M]
"""
import json, os, sys

S = os.path.dirname(os.path.abspath(__file__))
REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'
idx = json.load(open(f'{S}/card-index.json'))
L = json.load(open(f'{REPO}/decisions/v2/_links.json'))['cross_area_duplicates']
a = sys.argv
lo = int(a[a.index('--from') + 1]) if '--from' in a else 0
hi = int(a[a.index('--to') + 1]) if '--to' in a else len(L) - 1
for n, e in enumerate(L):
    if not lo <= n <= hi: continue
    k = e['keep']; K = idx[k]
    print(f'\n#{n}  KEEP {k}  [{K["area"]}]  rec={K["rec"]}\n    Q: {K["q"]}')
    for l, lab in K['options'].items():
        print(f'    {l}{"*" if l == K["rec"] else " "} {lab}')
    for d in e['ids']:
        if d == k: continue
        D = idx[d]
        print(f'  DROPPED {d}  [{D["area"]}]  rec={D["rec"]}\n    Q: {D["q"]}')
        for l, lab in D['options'].items():
            print(f'    {l}{"*" if l == D["rec"] else " "} {lab}')
    print(f'  OLD NOTE: {e["why"]}')
    if 'agree' in e: print(f'  (already done: agree={e["agree"]} map={e.get("map")})')
