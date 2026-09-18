#!/usr/bin/env python3
"""Validate the documentation pack against 62-DOC-SCHEMA.md.

    python3 docs/pack/tools/validate-pack.py [--quiet]

Exits 1 on any breach and prints one line per problem. What it checks is listed in
62-DOC-SCHEMA.md, "What the validator checks", and the two files are kept in step by hand
because a validator that validates its own specification is a circle.

It deliberately does not check whether a claim is true. No validator can, and a green build
that implies otherwise is worse than no build at all.
"""
import datetime
import pathlib
import re
import sys

PACK = pathlib.Path(__file__).resolve().parent.parent
ROOT = PACK.parent.parent
QUIET = '--quiet' in sys.argv

MODES = {'tutorial', 'how-to', 'reference', 'explanation'}
TIERS = {'canonical', 'derived', 'archive', 'superseded'}
STATUSES = {
    'draft', 'living', 'frozen', 'superseded',            # documents
    'specified', 'building', 'built', 'verified',          # screens
    'planned', 'shipped', 'withdrawn',                     # features
    'open', 'fixed', 'wontfix', 'duplicate',               # defects
    'decided', 'reversed',                                 # decisions
}
REQUIRED = ['id', 'title', 'mode', 'tier', 'status', 'updated', 'owner']

problems = []
covers_seen = {}   # id covered -> file that covers it
today = datetime.date.today()

SKIP = {'node_modules', '.next', '.git', 'out', 'dist', 'target', 'coverage'}


def index_by_name():
    """basename -> [paths], built once. Walking the tree per citation is minutes, not seconds."""
    idx = {}
    stack = [ROOT]
    while stack:
        d = stack.pop()
        try:
            entries = list(d.iterdir())
        except OSError:
            continue
        for e in entries:
            if e.name in SKIP or e.name.startswith('.') and e.is_dir():
                continue
            if e.is_dir():
                stack.append(e)
            else:
                idx.setdefault(e.name, []).append(e)
    return idx


BY_NAME = index_by_name()


def fm(text):
    """Parse the leading YAML block. Deliberately small: flat keys, and lists as [a, b]."""
    if not text.startswith('---\n'):
        return None
    end = text.find('\n---', 4)
    if end == -1:
        return None
    out = {}
    for line in text[4:end].split('\n'):
        line = line.split('  #')[0].rstrip()
        if not line or line.startswith('#') or ':' not in line:
            continue
        k, _, v = line.partition(':')
        v = v.strip().strip('"').strip("'")
        if v.startswith('[') and v.endswith(']'):
            v = [x.strip() for x in v[1:-1].split(',') if x.strip()]
        out[k.strip()] = v
    return out


def expand(ids):
    """[F001..F070] is a range, and writing seventy ids by hand is how a list goes wrong."""
    out = []
    for item in ids if isinstance(ids, list) else [ids]:
        m = re.fullmatch(r'([A-Za-z]+)(\d+)\.\.\1?(\d+)', str(item))
        if m:
            pre, a, b = m.group(1), m.group(2), m.group(3)
            out += [f'{pre}{str(n).zfill(len(a))}' for n in range(int(a), int(b) + 1)]
        else:
            out.append(str(item))
    return out


# graphify-out is a third-party tool's output, not a pack document, so it is not held
# to the pack's contract. It rebuilds from graph.json and carries its own provenance.
EXCLUDE = ('tools/', 'graphify-out/')
files = sorted(p for p in PACK.rglob('*.md')
               if not any(x in str(p.relative_to(PACK)) for x in EXCLUDE))
for path in files:
    rel = path.relative_to(ROOT)
    text = path.read_text(encoding='utf-8')
    meta = fm(text)
    if meta is None:
        problems.append(f'{rel}: no front matter, or it does not parse')
        continue

    for key in REQUIRED:
        if not meta.get(key):
            problems.append(f'{rel}: missing required key `{key}`')

    if meta.get('mode') and meta['mode'] not in MODES:
        problems.append(f'{rel}: mode `{meta["mode"]}` is not one of {sorted(MODES)}')
    if meta.get('tier') and meta['tier'] not in TIERS:
        problems.append(f'{rel}: tier `{meta["tier"]}` is not one of {sorted(TIERS)}')
    if meta.get('status') and meta['status'] not in STATUSES:
        problems.append(f'{rel}: status `{meta["status"]}` is not in the vocabulary')

    tier = meta.get('tier')
    if tier == 'canonical' and not meta.get('verified_against'):
        problems.append(f'{rel}: tier is canonical, so `verified_against` is required')
    if tier == 'derived' and not meta.get('generated_by'):
        problems.append(f'{rel}: tier is derived, so `generated_by` is required')
    if tier == 'superseded':
        sb = meta.get('superseded_by')
        if not sb:
            problems.append(f'{rel}: tier is superseded, so `superseded_by` is required')
        elif not list(PACK.rglob(f'{sb}.md')):
            problems.append(f'{rel}: superseded_by `{sb}` names a file that does not exist')

    if meta.get('id') and meta['id'] != path.stem:
        problems.append(f'{rel}: id `{meta["id"]}` does not match the filename `{path.stem}`')

    u = meta.get('updated')
    if u:
        try:
            d = datetime.date.fromisoformat(str(u))
            if d > today:
                problems.append(f'{rel}: updated `{u}` is in the future')
        except ValueError:
            problems.append(f'{rel}: updated `{u}` is not an ISO date')

    for cid in expand(meta.get('covers', [])):
        if cid in covers_seen and covers_seen[cid] != rel:
            problems.append(f'{rel}: id `{cid}` is also covered by {covers_seen[cid]}. One fact, one home.')
        covers_seen[cid] = rel

    body = text[text.find('\n---', 4) + 4:] if text.startswith('---\n') else text
    for dash in ('—', '–'):
        if dash in body:
            n = body.count(dash)
            problems.append(f'{rel}: {n} em or en dash(es). Plain hyphens only.')
            break

    # A line citation into a living, section-numbered document is stale the next time
    # somebody inserts a paragraph above it. That already happened once: the plan was
    # edited on 18 September and 209 citations moved. Cite the section instead.
    for living in ('docs/mvp0/PRODUCT-PLAN.md', 'docs/mvp0/PRODUCT-GUIDE.md'):
        n = len(re.findall(re.escape(living) + r':\d+', text))
        if n:
            problems.append(f'{rel}: {n} line citation(s) into {living}. '
                            f'Cite the section instead: run tools/stabilise-citations.py')

    # Citations of the form path/file.md:NNN have to point at a line that exists.
    # A bare filename is allowed as a short form, as long as exactly one file in the
    # repository carries that name. Two matches is an ambiguous citation, which is worse
    # than a wrong one, because it looks right.
    for m in re.finditer(r'`([\w./-]+\.(?:md|ts|tsx|mjs|py|json)):(\d+)`', text):
        ref, line = m.group(1), int(m.group(2))
        target = ROOT / ref
        if not target.exists():
            hits = (BY_NAME.get(ref, []) if '/' not in ref
                    else [h for h in BY_NAME.get(ref.rsplit('/', 1)[-1], [])
                          if str(h).endswith('/' + ref)])
            if len(hits) == 1:
                target = hits[0]
            elif len(hits) > 1:
                problems.append(f'{rel}: cites `{ref}:{line}` and {len(hits)} files carry that name. Use the full path.')
                continue
        if not target.exists():
            problems.append(f'{rel}: cites `{ref}:{line}` and that file does not exist')
        else:
            try:
                n = len(target.read_text(encoding='utf-8', errors='replace').splitlines())
                if line > n:
                    problems.append(f'{rel}: cites `{ref}:{line}` but it has {n} lines')
            except OSError:
                pass

if not QUIET:
    print(f'pack: {len(files)} files, {len(covers_seen)} covered ids')
for p in problems:
    print('  ' + p)
print(f'problems: {len(problems)}')
sys.exit(1 if problems else 0)
