#!/usr/bin/env python3
"""Build the founders' checklist page from the review data files.

    python3 docs/pack/tools/build-checklist.py

Reads docs/pack/review/checklist-items-44.json (the first 44 items) and
checklist-items-19sep.json (the second pass), adds the handful of actions no log carries, and writes
docs/pack/review/checklist.html. That file is published as the checklist artifact; answers save in
the artifact's store under `answers/<doc id>`: `iNN` for the first 44, `x-<id>` for the rest.
"""
import html
import json
import pathlib

REVIEW = pathlib.Path(__file__).resolve().parent.parent / 'review'

# Actions that are founder decisions already taken, or approvals, which no log row carries.
EXTRA = [
    dict(id='M1', kind='act', q='The live site sends the privacy, terms, pricing and refunds pages to the login screen. The fix is on the working branch, not on the one that deploys.',
         a='Merge the branch into main now, which puts it live on frontmatter.in', b='Wait until batch 2 and merge then',
         rec='A, because a stranger cannot read the price or the terms today. It also deploys everything else on the branch; verify is green on it.'),
    dict(id='M2', kind='act', q='You decided every account moves to the company before the first stranger. Who moves them, and when?',
         a='You do it in batch 1, the first two weeks', b='Later, before the pilot',
         rec='A, because batch 1 is where the plan puts it and nothing in it needs code.'),
    dict(id='M3', kind='act', q='You approved the one-time $10 OpenRouter credit. It lifts the free pool from 50 to 1,000 requests a day.',
         a='Buy it now', b='Buy it when the AI batch starts',
         rec='B is fine: nothing uses it before batch 4. Claude will not buy anything.'),
    dict(id='M4', kind='professional', q='Five legal questions are waiting for one lawyer: the export lock after an unpaid trial, whether we are an intermediary for published pages, which complaint deadline applies, how long logs are kept after deletion, and whether voice needs its own consent.',
         a='Brief one lawyer with all five together', b='Ask one at a time as each batch needs it',
         rec='A, because one brief costs less than five and two of the answers shape batch 2.'),
    dict(id='M5', kind='professional', q='Which GST heading a subscription editor falls under.',
         a='Ask a chartered accountant before Pro goes on sale', b='Ask now',
         rec='A, because nothing is sold until batch 7. Items 17 to 20 are this same question.'),
]
DUPES = {
    'SBR-07': 'Same question as VP-01 (voice minutes) and VP-06 (PDF size). Your answers there settle this.',
    'SBR-01': None,
}


def build():
    old = json.loads((REVIEW / 'checklist-items-44.json').read_text())
    new = json.loads((REVIEW / 'checklist-items-19sep.json').read_text()) + EXTRA
    items = []
    for it in old:
        items.append(dict(key='i%02d' % it['n'], label=str(it['n']), kind=it['k'], q=it['q'], rec=it['r'],
                          a=None, b=None, src=it['s'], raw=True))
    for it in new:
        kind = {'professional': 'pro'}.get(it['kind'], it['kind'])
        rec = html.escape(it['rec'])
        if DUPES.get(it['id']):
            rec = '<b>' + html.escape(DUPES[it['id']]) + '</b> ' + rec
        items.append(dict(key='x-' + it['id'].lower(), label=it['id'], kind='big' if it['id'] == 'SBR-01' else kind,
                          q=it['q'], rec=rec, a=it['a'], b=it['b'],
                          src=it.get('where', 'founder action').replace('`', ''), raw=False))
    return items


PAGE = open(pathlib.Path(__file__).with_name('checklist-template.html')).read()


def main():
    items = build()
    data = json.dumps([{k: v for k, v in it.items() if k != 'raw'} for it in items], ensure_ascii=False)
    out = PAGE.replace('/*ITEMS*/[]', data).replace('{{COUNT}}', str(len(items)))
    (REVIEW / 'checklist.html').write_text(out, encoding='utf-8')
    kinds = {}
    for it in items:
        kinds[it['kind']] = kinds.get(it['kind'], 0) + 1
    print(f'wrote review/checklist.html: {len(items)} items {kinds}')


if __name__ == '__main__':
    main()
