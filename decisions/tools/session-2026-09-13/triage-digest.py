"""Print a compact digest of the SERVED decision cards for triage.

usage: python3 triage-digest.py "<area name>" ["<area name>" ...]   (or: all)

One block per card: id, weight, question, the stakes line, each option with * on the
recommendation, linked cards, and the areas it was merged from. Enough to judge WHEN a card needs
an answer without opening the area files.
"""
import json, re, sys

REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'
src = open(f'{REPO}/decisions/questions.js', encoding='utf-8').read()
Q = json.loads(src[src.index('['):src.rindex(']') + 1])
want = None if sys.argv[1:] == ['all'] else set(sys.argv[1:])
title = {q['id']: q['q'] for q in Q}
n = 0
for q in Q:
    if want and q['cat'] not in want: continue
    n += 1
    print(f"\n## {q['id']}  [{q['cat']} / {q.get('weight')}]  {q['q']}")
    if q.get('stakes'): print(f"   stakes: {q['stakes']}")
    for o in q.get('options') or []:
        print(f"   {o['k']}{'*' if o['k'] == q.get('rec') else ' '} {o['label']}")
    if q.get('flip'): print(f"   flips if: {q['flip']}")
    if q.get('linked'): print(f"   linked: " + '; '.join(f"{i} ({title.get(i, '?')[:70]})" for i in q['linked']))
    if q.get('dupes'): print(f"   also asked in: {', '.join(q['dupes'].get('areas') or [])}")
print(f'\n{n} cards')
