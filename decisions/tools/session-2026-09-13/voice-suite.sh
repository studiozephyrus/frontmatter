#!/bin/bash
# Run every sgnk writing-style check on one markdown file. Usage: voice-suite.sh <file.md>
F="$1"; SC=/Users/sagnikmitra/Desktop/GitHub/sgnkai/scoring
T=$(mktemp -d)/body.txt
# Plain text for the scorers: drop the YAML block, code fences and table rows; keep prose.
python3 - "$F" "$T" <<'PY'
import re, sys
t = open(sys.argv[1], encoding='utf-8').read()
t = re.sub(r'^---\n.*?\n---\n', '', t, flags=re.S)
t = re.sub(r'```.*?```', '', t, flags=re.S)
t = '\n'.join(l for l in t.split('\n') if not l.lstrip().startswith('|'))
t = t.split('\n## Sources')[0]
open(sys.argv[2], 'w').write(t)
PY
echo "== 1. test_gate.py (the gate proves itself first)"; python3 $SC/test_gate.py 2>&1 | tail -1
echo "== 2. gate.py";            python3 $SC/gate.py --file "$F" 2>&1 | head -20
echo "== 3. gate.py --strict";   python3 $SC/gate.py --file "$F" --strict 2>&1 | head -20
echo "== 4. bands_lint.py";      python3 $SC/bands_lint.py --file "$F" 2>&1 | head -20; echo "exit=${PIPESTATUS[0]}"
echo "== 5. rhythm_lint.py";     python3 $SC/rhythm_lint.py --file "$T" 2>&1 | head -30
echo "== 6. slop_scan.py";       python3 $SC/slop_scan.py --file "$T" 2>&1 | head -70
echo "== 7. style_score.py"
if [ -x $SC/.venv/bin/python ]; then $SC/.venv/bin/python $SC/style_score.py --file "$T" 2>&1 | tail -12; else echo "no .venv at $SC/.venv; skipped"; fi
