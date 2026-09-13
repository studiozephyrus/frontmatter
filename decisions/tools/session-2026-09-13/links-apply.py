"""Apply merge-note rewrites to decisions/v2/_links.json, save, and re-verify.

usage: python3 links-apply.py <patch.json>

patch.json: { "<index>": {"keep": "<kept id>", "why": "<new note>", "map": {"<dropped id>": "b" | null, ...},
               "agree": true | false }, ... }
An entry is refused if "keep" does not match that index, or if it fails the per-entry checks
(no card ids in the note, no em-dash, at most 55 words, map covers exactly the dropped cards with
letters that exist on the kept card, agree consistent with the map). Accepted entries are saved
immediately in the file's existing format, so a stopped run keeps its progress.
"""
import json, os, re, sys

S = os.path.dirname(os.path.abspath(__file__))
FP = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/decisions/v2/_links.json'
idx = json.load(open(f'{S}/card-index.json'))
IDS = re.compile(r'\b(?:' + '|'.join(sorted(map(re.escape, idx), key=len, reverse=True)) + r')\b')


def save(d):
    with open(FP, 'w', encoding='utf-8') as f:
        f.write(json.dumps(d, ensure_ascii=True, indent=1))


def problems(e, p):
    keep = e['keep']; dropped = [i for i in e['ids'] if i != keep]; P = []
    if p.get('keep') != keep: P.append(f'keep is {keep}, patch says {p.get("keep")}')
    w = p.get('why') or ''
    if not w: P.append('empty note')
    if IDS.search(w): P.append(f'note names a card id {IDS.findall(w)[:3]}')
    if '—' in w: P.append('em-dash in note')
    if len(w.split()) > 55: P.append(f'note is {len(w.split())} words')
    m = p.get('map')
    if not isinstance(m, dict) or set(m) != set(dropped): P.append(f'map must cover exactly {dropped}')
    else:
        for d, v in m.items():
            if v is not None and v not in idx[keep]['options']: P.append(f'{d} -> {v!r} is not an option on {keep}')
        want = all(v == idx[keep]['rec'] for v in m.values())
        if p.get('agree') is not want: P.append(f'agree must be {want} for this map')
    return P


if __name__ == '__main__':
    patch = json.load(open(sys.argv[1]))
    d = json.load(open(FP)); L = d['cross_area_duplicates']
    ok, bad = [], []
    for n, p in patch.items():
        n = int(n)
        if not 0 <= n < len(L): bad.append((n, ['no such index'])); continue
        P = problems(L[n], p)
        if P: bad.append((n, P)); continue
        L[n]['why'] = p['why']; L[n]['map'] = p['map']; L[n]['agree'] = p['agree']; save(d); ok.append(n)
    print(f'applied {len(ok)}  refused {len(bad)}')
    for n, P in bad: print(f'  REFUSED #{n}:', '; '.join(P))
    done = sum(1 for e in L if 'agree' in e)
    print(f'entries done {done} of {len(L)}')
