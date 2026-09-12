#!/usr/bin/env python3
"""Assemble the fifteen per-area v2 files into decisions/questions.js.

Ordering follows the plan's own reading order, not the order the areas were found in,
because a reader working through 300 decisions should meet them the way the plan
argues them: what the thing is, then what shape it takes, then what it does.

    python3 build-v2.py <v2-dir> [--links links.json] [--out questions.js] [--dry]
"""
import argparse
import json
import pathlib
import sys
import collections

ORDER = [
    'Product & definition',
    'Form factor & surfaces',
    'Features',
    'Flow & interaction',
    'Design, UI & attention',
    'Engine & technical',
    'Access, offline & install',
    'Market & competition',
    'Pricing & tiers',
    'Go-to-market & channels',
    'Business & operations',
    'Legal, privacy & data',
    'Name & identity',
    'Plan, scope & sequencing',
    'Research & evidence',
]

WEIGHT_RANK = {'critical': 0, 'high': 1, 'medium': 2}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('--links')
    ap.add_argument('--out', default='/Users/sagnikmitra/Desktop/GitHub/frontmatter/decisions/questions.js')
    ap.add_argument('--dry', action='store_true')
    a = ap.parse_args()

    src = pathlib.Path(a.src)
    files = sorted(p for p in src.glob('*.json') if not p.name.startswith('_'))
    if not files:
        sys.exit(f'no area files in {src}')

    by_cat = {}
    for f in files:
        d = json.loads(f.read_text())
        cat = d.get('cat')
        qs = d.get('questions') or []
        if not cat or not qs:
            print(f'  skip {f.name}: no cat or no questions')
            continue
        by_cat[cat] = qs

    missing = [c for c in ORDER if c not in by_cat]
    extra = [c for c in by_cat if c not in ORDER]
    if missing:
        print(f'  MISSING AREAS: {missing}')
    if extra:
        print(f'  UNEXPECTED AREAS: {extra}')

    # Apply the cross-area pass: drop duplicates, add link edges.
    area_of = {q['id']: cat for cat, qs in by_cat.items() for q in qs}
    dropped = set()
    dupes = {}
    edges = collections.defaultdict(set)
    if a.links:
        L = json.loads(pathlib.Path(a.links).read_text())
        for dup in L.get('cross_area_duplicates') or []:
            keep = dup.get('keep')
            for i in dup.get('ids') or []:
                if i != keep:
                    dropped.add(i)
            # A dropped duplicate still deserves a link from the survivor.
            for i in dup.get('ids') or []:
                if i != keep:
                    edges[keep].add(i)
            # And the survivor carries what was dropped, because the dedup matched on the
            # QUESTION and never compared recommendations. Measured: the free-engine probe was
            # asked five times and the four dropped cards recommended b, b, b and c while the
            # survivor recommends a -- so the reader sees the minority view with no sign that
            # four other passes disagreed. Surfacing the dropped ids and the linker's own note
            # is the cheapest honest fix; merging the recommendations would be inventing one.
            others = [i for i in (dup.get('ids') or []) if i != keep]
            if keep and others:
                # The reader cannot open a dropped card, so its id means nothing on the page. Carry
                # the areas it came from instead. `agree` is set per entry from a mapping of each
                # dropped recommendation onto the kept card's options; without it the page makes
                # no claim either way, because the old fixed "they did not all agree" line was
                # false on the entries whose recommendations matched.
                areas = []
                for i in others:
                    c = area_of.get(i)
                    if c and c != area_of.get(keep) and c not in areas:
                        areas.append(c)
                dupes[keep] = {'dropped': others, 'areas': areas, 'why': dup.get('why') or ''}
                if isinstance(dup.get('agree'), bool):
                    dupes[keep]['agree'] = dup['agree']
        for e in L.get('link_edges') or []:
            if e.get('from') and e.get('to'):
                edges[e['from']].add(e['to'])
                edges[e['to']].add(e['from'])

    out = []
    for cat in ORDER + extra:
        qs = by_cat.get(cat) or []
        qs = [q for q in qs if q.get('id') not in dropped]
        # Within an area: critical first, then the generator's own order.
        qs.sort(key=lambda q: WEIGHT_RANK.get(q.get('weight'), 3))
        out.extend(qs)

    live = {q['id'] for q in out}
    for q in out:
        got = set(q.get('linked') or []) | edges.get(q['id'], set())
        q['linked'] = sorted(i for i in got if i in live and i != q['id'])[:6]
        if q['id'] in dupes:
            q['dupes'] = dupes[q['id']]

    stats = collections.Counter(q['cat'] for q in out)
    weights = collections.Counter(q.get('weight') for q in out)
    kinds = collections.Counter((q.get('visual') or {}).get('kind') for q in out)
    novis = [q['id'] for q in out if not (q.get('visual') or {}).get('kind')]
    noev = [q['id'] for q in out if not q.get('evidence')]
    linked_n = sum(1 for q in out if q['linked'])

    print(f'\n{len(out)} cards across {len(stats)} areas '
          f'({len(dropped)} cross-area duplicates dropped)')
    for c in ORDER + extra:
        if stats.get(c):
            print(f'  {stats[c]:>3}  {c}')
    print(f'\nweights: {dict(weights)}')
    print(f'diagrams: {dict(kinds)}')
    print(f'cards with no diagram: {len(novis)} {novis[:8]}')
    print(f'cards with no evidence: {len(noev)}')
    print(f'cards with at least one link: {linked_n}/{len(out)}')

    if a.dry:
        return

    body = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    header = (
        '/* frontmatter — the decisions.\n'
        ' *\n'
        ' * Generated. Do not edit by hand: edit the source documents in docs/, re-run the\n'
        ' * extraction round, and rebuild. Every card is a projection of the corpus, which is\n'
        ' * the same law the product itself runs on.\n'
        ' *\n'
        f' * {len(out)} decisions · {sum(1 for q in out if q.get("weight") == "critical")} critical · '
        f'{sum(len(q.get("evidence") or []) for q in out)} evidence exhibits\n'
        ' */\n'
    )
    p = pathlib.Path(a.out)
    p.write_text(header + 'window.QUESTIONS=' + body + ';\n')
    print(f'\nwrote {p} ({p.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
