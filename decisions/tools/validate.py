#!/usr/bin/env python3
"""Check generated decision cards against CONTRACT.md.

Written before any card exists, so it is not shaped by what the generator happened to
produce. Run it against the OLD corpus too — a check that cannot fail on the unfixed
input is not a check (LR#68).

    python3 validate.py <file.json|dir> [--corpus /path/to/repo]

Exit 1 if any ERROR. WARNs are reported and do not fail.
"""
import json
import os
import re
import sys
import pathlib
import collections

REPO = pathlib.Path('/Users/sagnikmitra/Desktop/GitHub/frontmatter')

REQUIRED = ['id', 'cat', 'sub', 'weight', 'q', 'lede', 'visual', 'stakes',
            'state', 'path', 'tension', 'options', 'rec', 'recCase', 'sources']
OPTIONAL = ['evidence', 'linked', 'flip']
OPT_REQUIRED = ['k', 'label', 'what', 'gains', 'costs', 'system', 'screens', 'money']

VISUAL_KINDS = {'screen', 'flow', 'state', 'compare', 'ba', 'arch', 'timeline',
                'matrix', 'file', 'funnel'}

# Marketing verbs and LLM cadence. Bounded so "delegate" does not match "delve"
# and "ecosystems" in a real quoted title is not punished (LR#73 substring family).
SLOP = [
    r'(?<!-)\bleverag(e|es|ed|ing)\b(?!-)', r'\bunlock(s|ed|ing)?\b', r'\bseamless(ly)?\b',
    r'\brobust\b', r'\bdelve(s|d)?\b', r'\bholistic\b', r'\bstreamlin(e|es|ed|ing)\b',
    r'\bempower(s|ed|ing)?\b', r'\bgame[- ]chang(er|ing)\b', r'\bbest[- ]in[- ]class\b',
    r'\bcutting[- ]edge\b', r'\bstate[- ]of[- ]the[- ]art\b', r'\bparadigm\b',
    r'\bsynerg(y|ies|istic)\b', r'\bfrictionless\b', r'\bdelight(ful|s)?\b',
    r'\bnavigat(e|ing) the\b', r'\bin today\'?s\b', r'\bever[- ]evolving\b',
    r'\bit is (important|worth) (to note|noting)\b', r'\bthis raises the question\b',
    r'^\s*(Moreover|Furthermore|Additionally|In conclusion)\b',
    r'\bnot just [^,.]{2,40}, but\b', r'\bnot only [^,.]{2,40}, but also\b',
    r'\bat the end of the day\b', r'\btestament to\b', r'\bcrucial(ly)?\b',
    r'\bvital(ly)?\b', r'\bplethora\b', r'\bmyriad\b', r'\btapestry\b',
]
SLOP_RX = [re.compile(p, re.I | re.M) for p in SLOP]

# American spellings the corpus does not use.
US = [(r'\bbehavior\b', 'behaviour'), (r'\brecognize', 'recognise'),
      (r'\bartifact\b', 'artefact'), (r'\borganiz(e|ed|ing|ation)', 'organis…'),
      (r'\bcolor\b', 'colour'), (r'\blicense\b (?=fee|key|to sell)', 'licence')]

LIMITS = {
    'lede': 140, 'stakes': 260, 'q': 190,
    'opt.label': 84, 'opt.what': 200, 'opt.system': 170,
    'opt.screens': 170, 'opt.money': 170, 'flip': 300,
    'bullet': 190, 'visual.caption': 74,
}

VIS_LIMITS = {
    'screen': ('panes', 3), 'flow': ('nodes', 8), 'state': ('states', 4),
    'compare': ('cols', 3), 'matrix': ('points', 7), 'file': ('lines', 12),
    'funnel': ('steps', 6), 'arch': ('layers', 6), 'timeline': ('items', 9),
}


class Report:
    def __init__(self):
        self.errors = collections.defaultdict(list)
        self.warns = collections.defaultdict(list)

    def err(self, qid, msg):
        self.errors[qid].append(msg)

    def warn(self, qid, msg):
        self.warns[qid].append(msg)


def words(s):
    return len(re.findall(r"[A-Za-z0-9'’-]+", s or ''))


def check_text(rep, qid, where, s):
    if not isinstance(s, str):
        return
    for rx in SLOP_RX:
        m = rx.search(s)
        if m:
            rep.err(qid, f'{where}: slop "{m.group(0).strip()}"')
    for rx, right in US:
        m = re.search(rx, s)
        if m:
            rep.warn(qid, f'{where}: US spelling "{m.group(0)}" (corpus uses {right})')
    if s.count('—') > 1:
        rep.warn(qid, f'{where}: {s.count("—")} em dashes in one field')
    for sent in re.split(r'(?<=[.?!])\s+', s):
        if words(sent) > 28:
            rep.warn(qid, f'{where}: {words(sent)}-word sentence')


def check_bullets(rep, qid, where, v, lo, hi):
    if not isinstance(v, list):
        rep.err(qid, f'{where}: must be an array of strings, got {type(v).__name__}')
        return
    if not (lo <= len(v) <= hi):
        rep.err(qid, f'{where}: {len(v)} bullets, contract says {lo}–{hi}')
    for i, b in enumerate(v):
        if not isinstance(b, str):
            rep.err(qid, f'{where}[{i}]: not a string')
            continue
        if len(b) > LIMITS['bullet']:
            rep.warn(qid, f'{where}[{i}]: {len(b)} chars (limit {LIMITS["bullet"]})')
        check_text(rep, qid, f'{where}[{i}]', b)


def check_visual(rep, qid, v):
    if not isinstance(v, dict):
        rep.err(qid, 'visual: missing or not an object')
        return
    k = v.get('kind')
    if k not in VISUAL_KINDS:
        rep.err(qid, f'visual.kind: "{k}" is not one of the ten primitives')
        return
    cap = v.get('caption')
    if not cap:
        rep.err(qid, 'visual.caption: required')
    elif len(cap) > LIMITS['visual.caption']:
        rep.warn(qid, f'visual.caption: {len(cap)} chars (limit {LIMITS["visual.caption"]})')
    if k in VIS_LIMITS:
        field, cap_n = VIS_LIMITS[k]
        arr = v.get(field)
        if not isinstance(arr, list) or not arr:
            rep.err(qid, f'visual.{field}: required and non-empty for kind "{k}"')
        elif len(arr) > cap_n:
            rep.err(qid, f'visual.{field}: {len(arr)} items, max {cap_n}')
    if k == 'matrix':
        pts = v.get('points') or []
        us = [p for p in pts if p.get('us')]
        if len(us) != 1:
            rep.err(qid, f'visual: matrix needs exactly one point with us:true, has {len(us)}')
        for p in pts:
            for ax in ('x', 'y'):
                if not isinstance(p.get(ax), (int, float)) or not 0 <= p[ax] <= 1:
                    rep.err(qid, f'visual: matrix point "{p.get("label")}" {ax} must be 0–1')
    if k == 'funnel':
        for s in v.get('steps') or []:
            if not isinstance(s.get('n'), (int, float)):
                rep.err(qid, f'visual: funnel step "{s.get("label")}" has no numeric n')
    if k == 'screen':
        for p in v.get('panes') or []:
            if len(p.get('rows') or []) > 5:
                rep.err(qid, f'visual: screen pane "{p.get("label")}" has {len(p["rows"])} rows, max 5')


def check_sources(rep, qid, srcs, corpus_ok):
    if not isinstance(srcs, list) or not srcs:
        rep.err(qid, 'sources: required, non-empty')
        return
    for s in srcs:
        if not isinstance(s, str):
            continue
        if s.startswith('merged:'):
            continue
        m = re.match(r'^([\w./-]+\.md):(\d+)$', s)
        if not m:
            continue
        if not corpus_ok:
            continue
        f, ln = REPO / m.group(1), int(m.group(2))
        if not f.exists():
            rep.err(qid, f'sources: {m.group(1)} does not exist')
        else:
            try:
                n = sum(1 for _ in f.open(errors='ignore'))
                if ln > n:
                    rep.err(qid, f'sources: {s} but that file has {n} lines')
            except OSError:
                pass


def check_question(rep, q, corpus_ok):
    qid = q.get('id', '<no id>')
    for k in REQUIRED:
        if k not in q or q[k] in (None, '', []):
            rep.err(qid, f'missing required field: {k}')
    for k in q:
        if k not in REQUIRED + OPTIONAL:
            rep.warn(qid, f'unknown field: {k}')

    if isinstance(q.get('q'), str) and not q['q'].rstrip().endswith('?'):
        rep.err(qid, 'q: must end with a question mark')
    if q.get('weight') not in ('critical', 'high', 'medium'):
        rep.err(qid, f'weight: "{q.get("weight")}" is not critical/high/medium')

    for f in ('q', 'lede', 'stakes', 'flip'):
        if isinstance(q.get(f), str):
            if f in LIMITS and len(q[f]) > LIMITS[f]:
                rep.warn(qid, f'{f}: {len(q[f])} chars (limit {LIMITS[f]})')
            check_text(rep, qid, f, q[f])

    check_bullets(rep, qid, 'state', q.get('state'), 2, 5)
    check_bullets(rep, qid, 'path', q.get('path'), 2, 5)
    check_bullets(rep, qid, 'tension', q.get('tension'), 2, 5)
    check_bullets(rep, qid, 'recCase', q.get('recCase'), 2, 5)
    check_visual(rep, qid, q.get('visual'))
    check_sources(rep, qid, q.get('sources'), corpus_ok)

    opts = q.get('options')
    if not isinstance(opts, list) or not 2 <= len(opts) <= 4:
        rep.err(qid, f'options: need 2–4, got {len(opts) if isinstance(opts, list) else "none"}')
        return
    keys = [o.get('k') for o in opts]
    if keys != list('abcd'[:len(opts)]):
        rep.err(qid, f'options: keys must be {list("abcd"[:len(opts)])}, got {keys}')
    if q.get('rec') not in keys:
        rep.err(qid, f'rec: "{q.get("rec")}" is not one of {keys}')
    for o in opts:
        w = f'option {o.get("k")}'
        for k in OPT_REQUIRED:
            if k not in o or o[k] in (None, '', []):
                rep.err(qid, f'{w}: missing {k}')
        for f in ('label', 'what', 'system', 'screens', 'money'):
            if isinstance(o.get(f), str):
                lim = LIMITS.get(f'opt.{f}')
                if lim and len(o[f]) > lim:
                    rep.warn(qid, f'{w}.{f}: {len(o[f])} chars (limit {lim})')
                check_text(rep, qid, f'{w}.{f}', o[f])
        if isinstance(o.get('label'), str) and o['label'].rstrip().endswith('.'):
            rep.warn(qid, f'{w}.label: trailing full stop')
        check_bullets(rep, qid, f'{w}.gains', o.get('gains'), 1, 4)
        check_bullets(rep, qid, f'{w}.costs', o.get('costs'), 1, 4)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    corpus_ok = '--no-corpus' not in sys.argv
    target = pathlib.Path(args[0])
    files = sorted(target.glob('*.json')) if target.is_dir() else [target]

    rep = Report()
    allq, ids = [], set()
    for f in files:
        if f.name.startswith('_'):
            continue
        data = json.loads(f.read_text())
        qs = data.get('questions', data if isinstance(data, list) else [])
        for q in qs:
            allq.append(q)
            qid = q.get('id')
            if qid in ids:
                rep.err(qid, 'duplicate id')
            ids.add(qid)

    for q in allq:
        check_question(rep, q, corpus_ok)

    for q in allq:
        for lid in q.get('linked') or []:
            if lid not in ids:
                rep.warn(q.get('id'), f'linked: {lid} is not in this set')

    ne = sum(len(v) for v in rep.errors.values())
    nw = sum(len(v) for v in rep.warns.values())
    print(f'{len(allq)} cards · {ne} errors · {nw} warnings\n')
    for qid in sorted(rep.errors):
        print(f'  ERROR {qid}')
        for m in rep.errors[qid]:
            print(f'        {m}')
    if nw:
        print()
        shown = 0
        for qid in sorted(rep.warns):
            if shown > 60:
                print(f'  … {nw - shown} more warnings')
                break
            for m in rep.warns[qid]:
                print(f'  warn  {qid}  {m}')
                shown += 1
    sys.exit(1 if ne else 0)


if __name__ == '__main__':
    main()
