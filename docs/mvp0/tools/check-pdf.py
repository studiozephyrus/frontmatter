#!/usr/bin/env python3
"""Pre-print check for a PDF built by docs/mvp0/build-pdf.mjs.

Measures what a reader would see, not what the markdown says:
  - the PDF is complete (ends in %%EOF) and how many pages it has
  - every page rasterised, and any ink found past the 15mm side and top margins or
    the 14mm bottom margin (bleed, overflow, an image too wide)
  - pages that are nearly empty (a break falling somewhere wasteful)
  - from the matching .print.html: tables that rendered with no body or with rows of
    the wrong width, and how many screen pairs and images it carries

    python3 docs/mvp0/tools/check-pdf.py docs/mvp0/<name>.pdf [--dpi 50]

Exits 1 if any page bleeds or any table is broken. A sparse final page is normal.
"""
import pathlib
import re
import subprocess
import sys
import tempfile

from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith('--')]
pdf = pathlib.Path(args[0])
dpi = int(sys.argv[sys.argv.index('--dpi') + 1]) if '--dpi' in sys.argv else 50
failed = False

# ---- completeness and page count
tail = pdf.read_bytes()[-32:]
pages = int(re.search(r'Pages:\s+(\d+)', subprocess.run(
    ['pdfinfo', str(pdf)], capture_output=True, text=True).stdout).group(1))
print(f'{pdf.name}: {pages} pages, trailer {"ok" if b"%%EOF" in tail else "MISSING"}')
if b'%%EOF' not in tail:
    failed = True

# ---- ink against the margins
tmp = tempfile.mkdtemp()
subprocess.run(['pdftoppm', '-png', '-r', str(dpi), str(pdf), tmp + '/p'], check=True)
MM = dpi / 25.4
SIDE, TOP, BOTTOM, SLACK = 15 * MM, 15 * MM, 14 * MM, 1.2 * MM
bleed, sparse = [], []
for f in sorted(pathlib.Path(tmp).glob('p-*.png')):
    n = int(f.stem.split('-')[-1])
    im = Image.open(f).convert('L')
    w, h = im.size
    box = Image.eval(im, lambda v: 255 if v < 220 else 0).getbbox()
    if box is None:
        sparse.append((n, 0.0))
        continue
    x0, y0, x1, y1 = box
    ink = sum(im.histogram()[:220]) / (w * h)
    over = []
    if x0 < SIDE - SLACK: over.append(f'left {(SIDE - x0) / MM:.1f}mm')
    if x1 > w - SIDE + SLACK: over.append(f'right {(x1 - (w - SIDE)) / MM:.1f}mm')
    if y0 < TOP - SLACK: over.append(f'top {(TOP - y0) / MM:.1f}mm')
    if y1 > h - BOTTOM + SLACK: over.append(f'bottom {(y1 - (h - BOTTOM)) / MM:.1f}mm')
    if over:
        bleed.append((n, ', '.join(over)))
    if ink < 0.012:
        sparse.append((n, ink))
print(f'pages with ink past a margin: {len(bleed)}')
for n, why in bleed:
    print(f'   page {n}: {why}')
    failed = True
print(f'nearly empty pages: {len(sparse)}' + (
    '  ' + ', '.join(f'{n} ({v * 100:.1f}%)' for n, v in sparse) if sparse else ''))

# ---- headings stranded at the foot of a page, read from the text layer
text = subprocess.run(['pdftotext', '-layout', str(pdf), '-'],
                      capture_output=True, text=True).stdout
stranded = []
for n, page in enumerate(text.split('\f'), 1):
    lines = [l.strip() for l in page.split('\n') if l.strip()]
    if not lines:
        continue
    last = lines[-1]
    if re.match(r'^PART [A-Z]+\.', last) or re.match(r'^§\s?\d+\b', last) \
            or re.match(r'^S\d\d\. ', last):
        stranded.append((n, last[:70]))
print(f'headings stranded at the foot of a page: {len(stranded)}')
for n, last in stranded:
    print(f'   page {n}: {last}')
    failed = True

# ---- tables and images, from the HTML the PDF was printed from
html = pdf.with_suffix('.print.html')
if html.exists():
    h = html.read_text(encoding='utf-8')
    tables = re.findall(r'<table>.*?</table>', h, re.S)
    broken = []
    for k, tb in enumerate(tables, 1):
        body = [r for r in re.findall(r'<tr>(?:(?!</tr>).)*?</tr>', tb, re.S) if '<td>' in r]
        if not body or {r.count('<td>') for r in body} != {tb.count('<th>')}:
            broken.append(re.sub(r'<[^>]+>', ' ', tb)[:60].split())
    print(f'tables: {len(tables)}, broken {len(broken)}')
    for b in broken:
        print('   ', ' '.join(b))
        failed = True
    print(f'screen pairs: {h.count(chr(60) + "div class=" + chr(34) + "pair")}, images: {h.count("<img")}')
else:
    print('no .print.html beside the PDF; table check skipped')

sys.exit(1 if failed else 0)
