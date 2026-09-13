"""Verify the exhibit (evidence) pass on one area file, or all of them.

usage: python3 ev-verify.py <area.json | all> [--dump]

Mechanical guarantees, each a hard failure:
  1. Everything on the card OUTSIDE `evidence` is byte-identical to the pinned original.
  2. Evidence SHAPE is identical: same blocks, types, keys, row and column counts, item lengths,
     and every non-string value (bar numbers, thresholds) unchanged.
  3. Per block, the multiset of file:line citations is identical (a citation may move between
     fields of the same block, e.g. out of a title into the note, but may not vanish).
  4. Per block, every "quoted span" and every `code span` survives byte-for-byte.
  5. Per block, no figure is lost: every number in the original (outside citations, quotes,
     code and internal codes) still appears in the rewrite.
  6. No em-dash outside quoted or code spans, and no spaced en-dash used as a substitute.

Reported, not failed: internal shorthand left in display text vs in citation slots, and numbers
that appear in the rewrite but not the original (usually a translated code, worth a glance).
"""
import json, glob, os, re, sys, collections

S = os.path.dirname(os.path.abspath(__file__))
REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'

CITE = re.compile(r'[\w./-]+\.(?:md|ts|tsx|js|json|jsonl|rules|mjs|html|css|py|yaml|yml|toml|txt|sh|pdf):\d+(?:[-–]\d+)?'
                  r'|\b[A-Za-z][\w.-]*[-\w]*:\d+(?:[-–]\d+)?')   # also extension-less refs: r17-h7:104, c4:82, DECIDE:216
QUOTE = re.compile(r'"[^"]{2,}?"')
CODE = re.compile(r'`[^`]+`')
CODES = re.compile(
    r'\bD-\d+\b|\b(?:AC|FL|FF|MK|PL|PR|KS|NF-?|MVP-|[BDEGLNPRKFSV])\d{1,2}(?:/\d)?[a-z]?\b'
    r'|§\s?\d+(?:\.\d+)*|\b[Ee]xhibits? \d+(?:\s?(?:,|and|to|–|-)\s?\d+)*'
    r'|\bv\d{1,2}(?:\.\d+)?\b|\b[a-z]{1,2}\d{1,2}(?:[-\s][a-z]{1,2}\d{1,2})?\b|\bR0\b')
SHOW = re.compile(
    r'\bD-\d+\b|\b(?:AC|FL|FF|MK|PL|PR|[BDEGLNP])\d{1,2}[a-z]?\b|\bKS\d\b|\bNF-\d+\b|\bMVP-\d(?:/\d)?\b'
    r'|\bR0\b|\bF\d{1,2}\b|\bS\d{1,2}[a-z]?\b|§\s?\d+|\b[Ee]xhibits? \d+|\bsidecar\b|\btint\w*\b'
    r'|\brail\b|\bv1[45]\b|\br\d{1,2}[-\s][a-z]{1,2}\d{1,2}\b')
KEEP_SHOW = {'R2', 'E76'}                      # Cloudflare R2, delta-E76: industry names
NUM = re.compile(r'\d+(?:[.,]\d+)*')
CITE_COLS = re.compile(r'^(source|sources|where|line|location|citation|document|section|file|ref|reference)$', re.I)


def strip_protected(s):
    return CODE.sub(' ', QUOTE.sub(' ', CITE.sub(' ', s)))


def shape(v):
    if isinstance(v, str): return 's'
    if isinstance(v, list): return [shape(x) for x in v]
    if isinstance(v, dict): return {k: shape(x) for k, x in v.items()}
    return v


def block_strings(b):
    """(text, is_citation_slot) for every rendered string in a block."""
    out = []
    for k in ('title', 'note', 'unit', 'thresholdLabel'):
        if isinstance(b.get(k), str): out.append((b[k], False))
    cols = b.get('cols') or []
    for c in cols:
        if isinstance(c, str): out.append((c, False))
    cite_idx = {i for i, c in enumerate(cols) if isinstance(c, str) and CITE_COLS.match(c.strip())}
    for r in b.get('rows') or []:
        for i, c in enumerate(r):
            if isinstance(c, str): out.append((c, i in cite_idx))
    for it in b.get('items') or []:
        for i, c in enumerate(it):
            if isinstance(c, str): out.append((c, i == 2))
    for d in b.get('data') or []:
        if d and isinstance(d[0], str): out.append((d[0], False))
    return out


def atoms(os_, ns_):
    """Hard-violation atoms for one block, every span taken PER STRING so a quote mark in one table
    cell never pairs with one in the next. Returns a sorted list of (kind, item); each lost item is
    its own atom, so fixing one of three lost citations shrinks the list instead of rewriting it."""
    def ms(rx, ss): return collections.Counter(x for s, _ in ss for x in rx.findall(s))
    out = []
    for rx, kind in ((CITE, 'citation lost:'), (QUOTE, 'quoted span altered or lost:'), (CODE, 'code span altered or lost:')):
        for x in (ms(rx, os_) - ms(rx, ns_)).elements(): out.append((kind, x[:70]))
    fig = lambda ss: collections.Counter(n for s, _ in ss for n in NUM.findall(CODES.sub(' ', strip_protected(s))))
    for x in (fig(os_) - fig(ns_)).elements(): out.append(('figure lost:', x))
    for s, _ in ns_:
        if '—' in CODE.sub(' ', QUOTE.sub(' ', s)): out.append(('em-dash outside quotes/code in:', s[:50]))
        if ' – ' in s: out.append(('spaced en-dash in:', s[:50]))
    return sorted(out)


def check_file(name, dump=False):
    old = json.load(open(f'{S}/ev/{name}'))['questions']
    new = json.load(open(f'{REPO}/decisions/v2/{name}'))['questions']
    V, extras, changed = [], [], []
    cnt = collections.Counter()
    if [q['id'] for q in old] != [q['id'] for q in new]:
        return ['card list or order changed'], cnt, extras, changed
    for o, n in zip(old, new):
        i = o['id']
        if {k: v for k, v in o.items() if k != 'evidence'} != {k: v for k, v in n.items() if k != 'evidence'}:
            V.append(f'{i}: a field outside evidence changed')
        oe, ne = o.get('evidence') or [], n.get('evidence') or []
        if shape(oe) != shape(ne):
            V.append(f'{i}: evidence shape changed'); continue
        for bi, (ob, nb) in enumerate(zip(oe, ne)):
            tag = f'{i} ev[{bi}]'
            for k in ob:
                if not isinstance(ob[k], (str, list)) and ob[k] != nb[k]: V.append(f'{tag}: {k} value changed')
            for od, nd in zip(ob.get('data') or [], nb.get('data') or []):
                if od[1:] != nd[1:]: V.append(f'{tag}: bar value changed')
            os_, ns_ = block_strings(ob), block_strings(nb)
            for kind, what in atoms(os_, ns_):
                V.append(f'{tag}: {kind} {what}')
            nn = collections.Counter(n for s, _ in ns_ for n in NUM.findall(CODES.sub(' ', strip_protected(s))))
            on = collections.Counter(n for s, _ in os_ for n in NUM.findall(CODES.sub(' ', strip_protected(s))))
            gained = nn - on
            if gained: extras.append(f'{tag}: new figure(s) {list(gained.elements())[:5]}')
            for (so, co), (sn, cn) in zip(os_, ns_):
                for s, c, when in ((so, co, 'before'), (sn, cn, 'after')):
                    hits = [h for h in SHOW.findall(strip_protected(s)) if h not in KEEP_SHOW]
                    cnt[f'{when}_{"cite" if c else "display"}'] += len(hits)
                    if when == 'after' and hits and not c: cnt.setdefault('left', 0); extras.append(f'{tag}: shorthand left {hits[:4]}')
                cnt['em_before'] += so.count('—')
                if so != sn: changed.append((tag, so, sn))
    if dump:
        for tag, a, b in changed: print(f'--- {tag}\n  - {a}\n  + {b}')
    return V, cnt, extras, changed


if __name__ == '__main__':
    arg = sys.argv[1]
    names = sorted(os.path.basename(f) for f in glob.glob(f'{S}/ev/*.json') if not os.path.basename(f).startswith('_')) \
        if arg == 'all' else [os.path.basename(arg)]
    bad = 0; T = collections.Counter(); ch = 0
    for nm in names:
        V, c, X, C = check_file(nm, '--dump' in sys.argv)
        T.update(c); ch += len(C); bad += len(V)
        print(f'{nm:34s} violations {len(V):3d}  strings changed {len(C):4d}  '
              f'shorthand display {c["before_display"]}->{c["after_display"]}  cite-slot {c["before_cite"]}->{c["after_cite"]}  em-dash before {c["em_before"]}')
        for v in V[:12]: print('   VIOLATION', v)
        for x in X[:12]: print('   note', x)
    if len(names) > 1:
        print(f'TOTAL violations {bad}  strings changed {ch}  shorthand display {T["before_display"]}->{T["after_display"]}  cite-slot {T["before_cite"]}->{T["after_cite"]}  em-dash before {T["em_before"]}')
    sys.exit(1 if bad else 0)
