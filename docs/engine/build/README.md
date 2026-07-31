# Dossier build

`build-dossier.py` generates `docs/engine/sgnk-markdown-engine-dossier.pdf` —
a 12-page A4 document in the sgnk design system.

    python3 docs/engine/build/build-dossier.py

Requires Google Chrome (headless `--print-to-pdf`) and the Mosvita family in
`~/Library/Fonts`. Fonts are base64-embedded into the HTML, so the PDF is
self-contained and renders identically on a machine without them installed.

Typography deviates from the sgnk system on one axis by explicit instruction:
Mosvita Expanded for display and Mosvita Regular for body, in place of Google
Sans. Code keeps a monospace stack — Mosvita has no monospace cut.
