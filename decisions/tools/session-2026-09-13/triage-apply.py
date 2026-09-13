"""Apply triage results to the v2 area files.

usage: python3 triage-apply.py <results.json> [--check]

results.json: [{"id": "P2", "when": "spec", "whenWhy": "...", "dependsOn": ["P24"]}, ...]
Refuses the whole batch if any entry is invalid: unknown id, id not served, bad `when`, a reason
over 25 words, an em-dash, a card id inside the reason (ids belong in dependsOn, where the page
turns them into links), a dependsOn id that is not a served card, or a self-dependency.
--check validates without writing. Writes preserve each file's format (indent 2, trailing newline).
"""
import json, glob, os, re, sys

REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'
WHEN = ('spec', 'pilot', 'evidence', 'launch', 'task')
src = open(f'{REPO}/decisions/questions.js', encoding='utf-8').read()
served = {q['id'] for q in json.loads(src[src.index('['):src.rindex(']') + 1])}
files = [f for f in sorted(glob.glob(f'{REPO}/decisions/v2/*.json')) if not os.path.basename(f).startswith('_')]
allids = {q['id']: f for f in files for q in json.load(open(f))['questions']}
IDS = re.compile(r'\b(?:' + '|'.join(sorted(map(re.escape, allids), key=len, reverse=True)) + r')\b')

res = json.load(open(sys.argv[1]))
bad = []
seen = set()
for r in res:
    i = r.get('id')
    if i not in allids: bad.append(f'{i}: unknown id'); continue
    if i not in served: bad.append(f'{i}: not a served card (dropped as a duplicate)')
    if i in seen: bad.append(f'{i}: listed twice')
    seen.add(i)
    if r.get('when') not in WHEN: bad.append(f'{i}: when must be one of {WHEN}')
    w = r.get('whenWhy') or ''
    if not w: bad.append(f'{i}: empty whenWhy')
    if len(w.split()) > 25: bad.append(f'{i}: whenWhy is {len(w.split())} words')
    if '—' in w: bad.append(f'{i}: em-dash in whenWhy')
    if IDS.search(w): bad.append(f'{i}: card id in whenWhy {IDS.findall(w)[:3]}')
    for d in r.get('dependsOn') or []:
        if d not in served: bad.append(f'{i}: dependsOn {d} is not a served card')
        if d == i: bad.append(f'{i}: depends on itself')
missing = sorted(served - seen)
print(f'entries {len(res)}  invalid {len(bad)}  served cards not covered {len(missing)}')
for b in bad[:30]: print('  INVALID', b)
if missing: print('  NOT COVERED', missing[:30])
if bad or '--check' in sys.argv: sys.exit(1 if bad else 0)

by = {r['id']: r for r in res}
for f in files:
    d = json.load(open(f)); ch = 0
    for q in d['questions']:
        r = by.get(q['id'])
        if not r: continue
        q['when'] = r['when']; q['whenWhy'] = r['whenWhy']
        if r.get('dependsOn'): q['dependsOn'] = r['dependsOn']
        else: q.pop('dependsOn', None)
        ch += 1
    if ch:
        open(f, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print('written')
