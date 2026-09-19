#!/usr/bin/env python3
"""Assemble the founders' review document from the pack, then append every screen.

    python3 docs/mvp0/tools/make-review-md.py docs/mvp0/REVIEW-<date>.md

Nothing here is written by hand. Each section is lifted from the file that owns it, so the review
cannot drift from the pack: decisions from 56, open items from review/00-FOUNDER-REVIEW.md, the
audit from review/AUDIT-*.md, each new feature from its research answer, the calendar from 50, the
file list from the pack README's generated index, and the screens from SCREENS.md. Then build it
with docs/mvp0/build-pdf.mjs.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[3]
PACK = ROOT / 'docs' / 'pack'
MVP = ROOT / 'docs' / 'mvp0'


def read(p):
    return (ROOT / p).read_text(encoding='utf-8')


def section(text, heading_re, level):
    """The body under the first heading matching heading_re, up to the next heading of that level
    or higher. Returns '' when the heading is missing, and the caller says so in the output."""
    lines = text.split('\n')
    start = None
    for i, l in enumerate(lines):
        if re.match(r'^' + '#' * level + r'\s', l) and re.search(heading_re, l):
            start = i + 1
            break
    if start is None:
        return ''
    out = []
    for l in lines[start:]:
        m = re.match(r'^(#+)\s', l)
        if m and len(m.group(1)) <= level:
            break
        out.append(l)
    return '\n'.join(out).strip()


def demote(md, by=1):
    """Push headings down so a lifted section nests under our own H2."""
    return re.sub(r'^(#{1,5})\s', lambda m: '#' * min(6, len(m.group(1)) + by) + ' ', md, flags=re.M)


def strip_front_matter(t):
    return re.sub(r'^---\n.*?\n---\n', '', t, count=1, flags=re.S)


def lifted(path, heading_re, level, fallback):
    body = section(strip_front_matter(read(path)), heading_re, level)
    if not body:
        return f'`{path}` has no section matching "{heading_re}". {fallback}'
    # H3 and below stay; anything at H2 or above inside the lift is pushed under our H2.
    return demote(body, by=max(0, 3 - level)) + f'\n\nSource: `{path}`.'


def main():
    out_path = ROOT / sys.argv[1]
    audit = sorted((PACK / 'review').glob('AUDIT-*.md'))[-1].relative_to(ROOT)
    parts = []
    add = parts.append

    add('---\ntitle: frontmatter, the review\nstatus: for the founders to review before development\n---\n')
    add('# frontmatter, the review\n')
    add('# Part one. What to review\n')
    add('## 1. How to read this document\n')
    add('- **Section 3 is the only one that needs you.** Every item there has a recommendation written beside it.')
    add('- Every other open point in the pack was resolved as a proposal and marked where it sits. '
        '`grep -rn "resolved (proposed" docs/pack` lists them in context.')
    add('- Parts two and three say what exists. Part four onwards is every screen, desktop and phone.')
    add('- Nothing in this document is typed by hand. `docs/mvp0/tools/make-review-md.py` lifts each section '
        'from the file that owns it, so the pack stays the one home for every fact.\n')

    add('## 2. What the founders have decided\n')
    add(lifted('docs/pack/56-OPEN-DECISIONS.md', r'The index', 2, 'See file 56.'))
    add('')
    add('## 3. What needs the founders\n')
    add(lifted('docs/pack/review/00-FOUNDER-REVIEW.md', r'What needs the founder', 2, 'See the review file.'))
    add('')
    add('## 4. The audit of 19 September\n')
    add(lifted(str(audit), r'Findings', 2, 'See the audit.'))
    add('')
    add(lifted(str(audit), r'Totals', 2, ''))
    add('')

    add('# Part two. What was added on 18 and 19 September\n')
    feats = [
        ('5. Sheets', 'docs/research/2026-09-18-sheets-boards/SHEETS.md', r'The answer in five lines', 2),
        ('6. Boards', 'docs/research/2026-09-18-sheets-boards/BOARDS.md', r'Recommendation', 3),
        ('7. One platform for every type', 'docs/research/2026-09-18-sheets-boards/ONE-PLATFORM.md', r'Three nouns and one rule', 3),
        ('8. Voice typing', 'docs/research/2026-09-19-voice/VOICE.md', r'The answer in one screen', 2),
        ('9. PDF to Markdown', 'docs/research/2026-09-19-pdf/PDF-TO-MARKDOWN.md', r'The answer first', 2),
        ('10. Storage and the mirror', 'docs/research/2026-09-18-storage/STORAGE-BENCHMARK.md', r'The architecture, in one line', 3),
    ]
    for title, path, rx, lvl in feats:
        add(f'## {title}\n')
        add(lifted(path, rx, lvl, 'See the file.'))
        add('')
    add('## 11. The roadmap and the calendar\n')
    add(lifted('docs/pack/50-ROADMAP.md', r'The short answer', 2, 'See file 50.'))
    add('')

    add('# Part three. Every pre-development file\n')
    add('## 12. The pack, file by file\n')
    readme = read('docs/pack/00-README.md')
    m = re.search(r'<!-- INDEX:START -->(.*?)<!-- INDEX:END -->', readme, re.S)
    idx = m.group(1) if m else 'The README index is missing.'
    idx = re.sub(r'\*\*Generated by.*?\*\*', '', idx)
    idx = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'`\1`', idx)
    add(demote(idx.strip(), by=0))
    add('\nEvery file lives under `docs/pack/`. The entry point is `00-README.md`, then '
        '`64-PORTABILITY-AND-HANDOVER.md`.\n')
    add('## 13. The research behind it\n')
    add('Folder | Files')
    add('---|---')
    for d in sorted((ROOT / 'docs' / 'research').glob('2026-09-1[3-9]*')):
        files = sorted(p.name for p in d.rglob('*.md'))
        if files:
            add(f'`{d.relative_to(ROOT)}` | {len(files)}: ' + ', '.join(f'`{f}`' for f in files[:8])
                + (' and more.' if len(files) > 8 else '.'))
    add('')
    add('## 14. The tools that keep it true\n')
    add('Tool | What it does')
    add('---|---')
    for p in sorted((PACK / 'tools').glob('*.py')) + sorted((PACK / 'tools').glob('*.mjs')) \
            + sorted((MVP / 'tools').glob('*.py')):
        doc = p.read_text(encoding='utf-8')
        m = re.search(r'"""(.*?)(?:\n\n|""")', doc, re.S) or re.search(r'^//\s*(.+)$', doc, re.M)
        first = (m.group(1).strip().split('\n')[0] if m else 'No description.').rstrip('.')
        add(f'`{p.relative_to(ROOT)}` | {first}.')
    add('')

    screens = strip_front_matter(read('docs/mvp0/SCREENS.md'))
    screens = re.sub(r'^# frontmatter, the screens\s*\n', '', screens, flags=re.M)
    offset = 14
    screens = re.sub(r'^## (\d+)\.', lambda m: f'## {int(m.group(1)) + offset}.', screens, flags=re.M)
    screens = re.sub(r'^# Part one\.', '# Part four.', screens, flags=re.M)
    screens = re.sub(r'^# Part two\.', '# Part five.', screens, flags=re.M)
    add(screens)

    out_path.write_text('\n'.join(parts) + '\n', encoding='utf-8')
    print(f'wrote {out_path.relative_to(ROOT)}: {len(out_path.read_text().split())} words')


if __name__ == '__main__':
    main()
