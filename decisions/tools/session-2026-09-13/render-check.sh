#!/bin/bash
# Render the LOCAL decisions page (byte-identical to the live deployment, checked by hash) in
# headless Chrome over file://, dump the DOM after scripts run, and read what a reader would see.
# No outbound request: the page, its data and its fonts are all local files.
S=/private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/9e5a4a9f-8c4a-4758-b560-0afea2b30447/scratchpad
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PAGE=/Users/sagnikmitra/Desktop/GitHub/frontmatter/decisions/index.html
PROF="$S/chrome-prof"; mkdir -p "$PROF"
dump() {   # $1 = card id; writes $S/dom-$1.html once </html> has been written, then kills Chrome
  local out="$S/dom-$1.html"; rm -f "$out"
  "$CHROME" --headless --disable-gpu --no-first-run --user-data-dir="$PROF" \
    --virtual-time-budget=8000 --dump-dom "file://$PAGE#$1" > "$out" 2>/dev/null &
  local pid=$! i=0
  while [ $i -lt 60 ]; do
    if grep -q '</html>' "$out" 2>/dev/null; then break; fi
    sleep 0.5; i=$((i+1))
  done
  kill "$pid" 2>/dev/null; wait "$pid" 2>/dev/null
  grep -q '</html>' "$out" || { echo "$1: no complete DOM after 30s"; return 1; }
}
for id in P2 G6 E6; do
  dump "$id" || continue
  python3 - "$S/dom-$id.html" "$id" <<'PY'
import re, sys, html
t = open(sys.argv[1], encoding='utf-8').read(); cid = sys.argv[2]
text = lambda s: html.unescape(re.sub(r'<[^>]+>', ' ', s)).split()
m = re.search(r'<details class="ev dupes">(.*?)</details>', t, re.S)
print(f'== {cid}  heading: {" ".join(text(re.search(r"<h1[^>]*>(.*?)</h1>", t, re.S).group(1)))[:90] if re.search(r"<h1", t) else "(no h1)"}')
if m: print('   merge box:', ' '.join(text(m.group(1)))[:330])
else: print('   merge box: none on this card')
ev = re.search(r'<div class="evbody">(.*?)</div></details>', t, re.S)
evtext = ' '.join(text(ev.group(1))) if ev else ''
q = re.sub(r'"[^"]{2,}?"', ' ', evtext)
print(f'   exhibits: {len(evtext.split())} words rendered, em-dashes outside quotes {q.count("—")}, '
      f'"did not all recommend the same option" present: {"did not all recommend the same option" in t}')
PY
done
