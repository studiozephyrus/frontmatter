#!/usr/bin/env python3
"""Assemble docs/pack/review/00-FOUNDER-REVIEW.md from the resolution logs beside it.

    python3 docs/pack/tools/build-review.py

Each log under docs/pack/review/ is a table whose last column says whether the founder must decide.
This pulls every "yes" row to the top, counts the rest per log, and links each log, so the founder
reads one file. Re-run it after any log changes; the output is generated and not edited by hand.
"""
import pathlib
import re

REVIEW = pathlib.Path(__file__).resolve().parent.parent / 'review'
OUT = REVIEW / '00-FOUNDER-REVIEW.md'


def rows(path):
    for line in path.read_text(encoding='utf-8').splitlines():
        if '|' not in line or line.startswith(('file |', '---', '|---')):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) >= 6:
            yield cells


def main():
    logs = sorted(p for p in REVIEW.glob('*.md') if p.name != OUT.name)
    founder, counts = [], []
    for p in logs:
        n = yes = 0
        for c in rows(p):
            n += 1
            if c[-1].lower().rstrip('.').startswith('yes'):
                yes += 1
                founder.append((p.name, c))
        counts.append((p.name, n, yes))

    out = ['---', 'id: 00-FOUNDER-REVIEW', 'title: Founder review of every open point',
           'mode: reference', 'tier: derived', 'status: living', 'updated: 2026-09-18',
           'owner: sagnik', 'generated_by: python3 docs/pack/tools/build-review.py', '---', '',
           '# Founder review of every open point', '',
           'Generated from the resolution logs of 18 September 2026. Every open point in the pack was',
           'resolved as a proposal, checked, or routed to the founder. Read section 1, then skim section 2.',
           '', '## 1. What needs the founder', '',
           'Log | Where | The point | What was proposed or done', '---|---|---|---']
    for name, c in founder:
        out.append(f'[{name}]({name}) | {c[0]} {c[1]} | {c[2].rstrip(".")}. | {c[3].rstrip(".")}.')
    out += ['', f'**{len(founder)} items need the founder.** Everything else below is resolved as a',
            'proposal or checked, and is listed in its log for review.', '',
            '## 2. Every log', '', 'Log | Items | Need the founder', '---|---|---']
    for name, n, yes in counts:
        out.append(f'[{name}]({name}) | {n}. | {yes}.')
    out += ['', 'Every resolved decision in the pack is marked `resolved (proposed 18 Sep, founder review)`',
            'where it sits, so `grep -rn "resolved (proposed" docs/pack` finds each one in context.', '']
    OUT.write_text('\n'.join(out), encoding='utf-8')
    print(f'wrote {OUT.name}: {len(founder)} founder items across {len(logs)} logs, '
          f'{sum(n for _, n, _ in counts)} rows')


if __name__ == '__main__':
    main()
