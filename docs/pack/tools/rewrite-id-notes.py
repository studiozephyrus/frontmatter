#!/usr/bin/env python3
"""One-off, 18 Sep 2026: replace the id-scheme notes at the top of each screen spec.

The notes described how each screen writer allocated private ids before the registers existed.
After apply-id-maps.py rewrote the ids, those notes became false (and read "C018 to C018").
This drops them and puts one accurate note in their place. Kept for the record and re-runnable:
it does nothing to a file that has no such note.
"""
import pathlib, re, textwrap
DROP = ('**Ids invented here.**', '**Error ids are provisional', '**Where the ids come from.**',
        '**Where this file proposes a new one**', '**`C076` upward', '**`C149` upward')
NOTE = ('**Where the ids come from.** Every `C`, `E`, `A` and `K` id below lives in its register: '
        '`14-COMPONENT-INVENTORY.md`, `17-ERROR-AND-REFUSAL-CATALOGUE.md`, `19-ACCEPTANCE-CRITERIA.md` '
        'and `16-COPY-DECK.md`. The ids this screen first proposed were reconciled into those '
        'registers on 18 September 2026. The old-to-new mapping is in `tools/error-map.json`, '
        '`tools/component-map.json` and `tools/acceptance-map.json`, and `tools/validate-pack.py` '
        'fails if any id here has no home.')

def bq(text):
    return '\n'.join('> ' + l for l in textwrap.wrap(text, 98))

for f in sorted((pathlib.Path(__file__).resolve().parent.parent / '12-screens').glob('S*.md')):
    t = f.read_text(encoding='utf-8')
    head, sep, rest = t.partition('\n## ')
    blocks = re.split(r'\n(?:>?[ \t]*)\n', head)   # paragraphs, whether split by '>' or blank lines
    out, placed, changed = [], False, False
    for b in blocks:
        flat = ' '.join(l[1:].strip() if l.startswith('>') else l for l in b.split('\n')).strip()
        if b.lstrip().startswith('>') and flat.startswith(DROP):
            changed = True
            if not placed:
                out.append(bq(NOTE)); placed = True
            continue
        if b.lstrip().startswith('>') and flat.startswith('**Identifiers.**'):
            changed = True
            keep = flat[flat.find('Copy ids are namespaced'):] if 'Copy ids are namespaced' in flat else ''
            ent = re.search(r'Entitlement and event ids.*?proposal\.', flat)
            new = NOTE + (' ' + ent.group(0) if ent else '') + (' ' + keep if keep else '')
            out.append(bq(new)); placed = True
            continue
        out.append(b)
    if changed:
        # blockquote paragraphs that were split by a bare '>' stay separate paragraphs
        f.write_text('\n\n'.join(out).rstrip('\n') + '\n' + sep + rest, encoding='utf-8')
        print('rewrote', f.name)
