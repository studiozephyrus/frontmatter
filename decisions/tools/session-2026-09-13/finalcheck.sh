#!/bin/bash
# Rebuild and run every check on the served set: validator, build, citations, the voice gate on
# card text + exhibits + merge notes separately, and the dupes payload the page will render.
S=/private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/9e5a4a9f-8c4a-4758-b560-0afea2b30447/scratchpad
G=/Users/sagnikmitra/Desktop/GitHub/sgnkai/scoring
cd /Users/sagnikmitra/Desktop/GitHub/frontmatter || exit 2
echo "HEAD $(git rev-parse --short HEAD)"
python3 decisions/tools/validate.py decisions/v2 2>&1 | grep -E 'cards ·'
python3 decisions/tools/build-v2.py decisions/v2 --links decisions/v2/_links.json 2>&1 | tail -1
node -e "
const fs=require('fs');const a=eval(fs.readFileSync('decisions/questions.js','utf8').match(/\[[\s\S]*\]/)[0]);
const ev=[], du=[];
for(const q of a){ for(const b of (q.evidence||[])){ ev.push(b.title||''); if(b.note)ev.push(b.note); (b.cols||[]).forEach(c=>ev.push(c));
  (b.rows||[]).forEach(r=>ev.push(r.join('. '))); (b.items||[]).forEach(i=>ev.push(i.filter(Boolean).join('. '))); (b.data||[]).forEach(d=>ev.push(String(d[0]))); }
  if(q.dupes) du.push(q.dupes.why); }
fs.writeFileSync('$S/served-exhibits.txt', ev.join('\n')); fs.writeFileSync('$S/served-dupes.txt', du.join('\n\n'));
const d=a.filter(q=>q.dupes); console.log('cards',a.length,'| with merge box',d.length,'| agree',d.filter(q=>q.dupes.agree===true).length,'disagree',d.filter(q=>q.dupes.agree===false).length,'no claim',d.filter(q=>typeof q.dupes.agree!=='boolean').length,'| empty areas',d.filter(q=>!(q.dupes.areas||[]).length).length);
const p2=a.find(q=>q.id==='P2'); console.log('P2 dupes:', JSON.stringify(p2.dupes).slice(0,260));"
echo "=== citations that must survive (pre-dejargon snapshot)"
python3 - "$S" <<'PY'
import json, glob, os, sys
S = sys.argv[1]; inv = json.load(open(f'{S}/invariants-dejargon.json')); tot = lost = 0; L = []
for f in sorted(glob.glob('decisions/v2/*.json')):
    if os.path.basename(f).startswith('_'): continue
    for q in json.load(open(f))['questions']:
        blob = json.dumps(q, ensure_ascii=False)
        for c in inv.get(q['id'], {}).get('mustCite', []):
            tot += 1
            if c not in blob: lost += 1; L.append((q['id'], c))
print(f'  checked {tot}, lost {lost}', L[:6])
PY
echo "=== voice gate (test suite first)"
python3 $G/test_gate.py 2>&1 | tail -1
for f in served-final served-exhibits served-dupes; do printf '%-16s ' $f; python3 $G/gate.py --file "$S/$f.txt" 2>&1 | head -1 | sed 's|/private.*scratchpad/||'; done
python3 - "$S" <<'PY'
import sys, re
S = sys.argv[1]
for f in ('served-exhibits', 'served-dupes'):
    t = open(f'{S}/{f}.txt').read(); W = len(t.split())
    q = re.sub(r'"[^"\n]{2,}?"', ' ', t); q = re.sub(r'`[^`\n]+`', ' ', q)
    print(f'  {f}: {W:,} words, em-dashes {t.count("—")} total, {q.count("—")} outside quotes/code ({q.count("—")/W*1000:.2f} per 1,000)')
PY
