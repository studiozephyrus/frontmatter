"""Post-run check for the label and diagram pass.

Mechanical: rec, option k order, every prose field, evidence, sources, and the diagram SHAPE must
be unchanged. Label text and diagram text may change.

Not mechanical: whether a relabelled option still means the same choice. No regex can tell, so
this prints every changed label side by side, recommended ones first, to be read by a person.
"""
import json, glob, os, hashlib, sys, re
S = sys.argv[1]
inv = json.load(open(f'{S}/invariants-labels.json'))
H = lambda v: hashlib.sha256(json.dumps(v, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]
PROSE = ('q','lede','stakes','state','tension','recCase','flip')
OPROSE = ('what','gains','costs','system','screens','money')
def shape(v):
    if isinstance(v, dict): return {k: shape(x) for k, x in v.items() if isinstance(x, (list, dict)) or k == 'kind'}
    if isinstance(v, list): return [len(v)] + [shape(x) for x in v if isinstance(x, (list, dict))]
    return v
J = re.compile(r'[\w./-]+\.(?:md|ts|tsx|js|json|rules|mjs):\d+|§\s?\d+|[Ee]xhibit \d+|\bMVP-\d(?:/\d)?\b|\bR0\b'
               r'|\bNF-\d+\b|\bsidecar\b|\btint\w*\b|\bF\d{1,2}\b|—')
viol, changed, lab, vis, over = [], [], 0, 0, []
for f in sorted(glob.glob('decisions/v2/*.json')):
    if os.path.basename(f).startswith('_'): continue
    for q in json.load(open(f))['questions']:
        p = inv[q['id']]; i = q['id']
        if q['rec'] != p['rec']: viol.append(f'{i} rec')
        if [o['k'] for o in q['options']] != p['ks']: viol.append(f'{i} k order')
        if H([q.get(k) for k in PROSE] + [[o.get(k) for k in OPROSE] for o in q['options']]) != p['prose']: viol.append(f'{i} prose')
        if H(q.get('evidence')) != p['ev']: viol.append(f'{i} evidence')
        if H(q.get('sources')) != p['sources']: viol.append(f'{i} sources')
        if shape(q.get('visual')) != p['visShape']: viol.append(f'{i} DIAGRAM SHAPE')
        if q['cat'] != p['cat'] or q['weight'] != p['weight']: viol.append(f'{i} cat/weight')
        for o, old in zip(q['options'], p['labels']):
            if o['label'] != old: changed.append((o['k'] == q['rec'], i, o['k'], old, o['label']))
            if len(o['label']) > 84: over.append(f"{i}{o['k']} {len(o['label'])}ch")
        lab += sum(len(J.findall(o['label'])) for o in q['options'])
        vis += len(J.findall(json.dumps(q.get('visual'), ensure_ascii=False)))
print(f'  invariant violations: {len(viol)}  {viol[:8]}')
print(f'  jargon left:  labels {lab} (was 214)   diagrams {vis} (was 333)')
print(f'  labels over 84 chars: {len(over)}  {over[:6]}')
print(f'  labels changed: {len(changed)}  ({sum(1 for c in changed if c[0])} of them are the RECOMMENDED option)')
json.dump([list(c) for c in changed], open(f'{S}/label-diff.json', 'w'), ensure_ascii=False, indent=1)
