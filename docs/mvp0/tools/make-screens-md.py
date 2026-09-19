#!/usr/bin/env python3
"""Generate docs/mvp0/SCREENS.md from the screen sections of PRODUCT-PLAN.md.

The screens sheet is the product as a person meets it, so each screen keeps its images
and its list of what is on it, and drops its "Why" block: the reasons live in the plan
and in the product guide. Never hand-edit SCREENS.md; edit the plan and re-run this.

    python3 docs/mvp0/tools/make-screens-md.py

This file used to live in a session scratchpad and was lost when the session resumed.
It lives in the repo now for that reason.
"""
import pathlib
import re

REPO = pathlib.Path(__file__).resolve().parents[3]
PLAN = REPO / 'docs/mvp0/PRODUCT-PLAN.md'
OUT = REPO / 'docs/mvp0/SCREENS.md'
EXPECTED = 42

t = PLAN.read_text(encoding='utf-8')
screens = t[t.index('### S01.'):t.index('## 6. Built in by default')].rstrip() + '\n'

# Drop each Why block: the "**Why.**" line and everything under it, up to the next
# heading. After the plan's bullet pass a Why block is often several lines long, so a
# single-line match would leave its bullets orphaned under the wrong screen.
kept, skipping = [], False
for line in screens.split('\n'):
    if line.startswith('**Why.**'):
        skipping = True
        continue
    if skipping and line.startswith(('### ', '## ')):
        skipping = False
    if not skipping:
        kept.append(line)
screens = re.sub(r'\n{3,}', '\n\n', '\n'.join(kept))

# The plan numbers the panel group 5b so it sits inside its own part two.
screens = screens.replace('## 5b. The configuration panel', '## 11. The configuration panel')
screens = screens.replace('## 5c. Sheets and boards', '## 12. Sheets and boards')
screens = screens.replace('## 5d. Voice and PDF to Markdown', '## 13. Voice and PDF to Markdown')

found = re.findall(r'^### (S\d\d)\.', screens, re.M)
assert found == [f'S{i:02d}' for i in range(1, EXPECTED + 1)], found
assert '**Why.**' not in screens

HEAD = '''---
title: frontmatter, the screens
version: v8, 18 September 2026
status: the final screens, for printing
---

# frontmatter, the screens

# Part one. What is in the product

## 1. In one page

**frontmatter is a markdown editor for people whose documents are increasingly written with, and for, AI agents.**

- One account, on the web, the desktop and the phone.
- Every editing feature is free, with quantities capped.
- Password links, Medium and High ideas, and the portfolio are on Pro.

Area | What is in it
The door | Sign in with Google or GitHub, one tap. Home with five ways to start. Settings on the account
Writing | Markdown mode and Doc mode in one Live editor. Four modes: Edit, Live, Reading, Split. The twelve-button toolbar. Tabs. A rail with the outline, tags, backlinks and comments in it. Dark mode
Help while writing | An AI box on an empty document. Seven AI verbs on a selection, with accept and reject in place. A problems panel and a formatter. The whole set of instruction files an agent reads
Blocks and views | Tables, callouts, Mermaid, maths, a chart block that reads the table above it, an Excalidraw drawing block. A document viewed as a page, slides, a mind map, a kanban or an outline; the flow view is deferred. The project map
Ideas | A collapsed section at the foot of the workspace tree. Ideas listed with their state. An industry template. Three depths: Low free, Medium and High on Pro. A blueprint of fifteen files in a skill folder, with a consistency check, an unlisted link, a hash printed on the page and a kickoff prompt that checks it
Sharing | People with roles. Links that expire, and on Pro need a password. Published pages with a markdown twin. Live editing with one collaborator on Free. A change queue for every change by a person, an AI edit or an agent. Document history
In and out | Drop files or a whole folder. Import from Obsidian, Notion, Google Docs or Word. GitHub connected as an app, Google Drive as two-way sync. Export to markdown, HTML, Word or PDF
Everywhere | Offline in the browser. The desktop app, with files on disk and no document limit. The phone, with a bottom bar, drawers, quick capture and the share sheet
Configuration | What each plan allows, the model routing, the provider chain and four feature flags, all set from a panel rather than from the source. Founders only
Money | Free: 50 cloud documents, 1 GB of uploads, 5 published pages, 1 live collaborator, 7-day history, 1 repository with 20 pushes, 1 Low blueprint and 10 AI edits a month. Pro at ₹299 a month: unlimited, 90-day history, password links, Medium and High, 100 edits and 5 blueprints on Claude, the portfolio
Voice and PDF | Push-to-talk dictation in English, cleaned up at three levels or left raw, and spoken commands that wait as proposals. A PDF read into markdown in the browser, from an empty document, the AI panel or its own tool
Later | The portfolio at frontmatter.in/@handle, the MCP server and API, Team, a custom domain, kanban and chart blocks

## 2. Reading the screens

- **Forty-two screens.** Thirty-eight are the product. Four are the configuration panel, which only a founder sees. The sheet, the board, voice and PDF to Markdown were drawn on 19 September. Eight screens carry a second or third frame for a state the founders asked to see.
- **Each screen** shows the desktop at 1,440 by 900 beside the phone at 390 by 844, both drawn from the design tokens of the shipped app, and then lists what is on it.
- **The phone follows the shipped code and carries the desktop's theme:** the mark, the title with its project, the editor full width, and the tree and the right pane as drawers.
- **The bottom bar** carries five actions at thumb height: Home, Search, AI, Outline and More, in that order. On the voice screens the mic takes the middle place and Outline steps out.
- **The order follows a person's day:** sign in, write, decide, share, bring things in, use it everywhere, and then the states nobody wants to see.
- **The reasons behind each screen** are in the product guide, sections 21 and 22. This sheet shows only what a person sees.

# Part two. The screens

## 3. Getting in

'''

GROUPS = [
    ('S04', '## 4. Writing\n\n'),
    ('S12', '## 5. Ideas\n\n'),
    ('S17', '## 6. Sharing\n\n'),
    ('S22', '## 7. Bringing things in and out\n\n'),
    ('S24', '## 8. Everywhere\n\n'),
    ('S28', '## 9. Account\n\n'),
    ('S31', '## 10. The states nobody wants, drawn anyway\n\n'),
]
body = screens
for sid, heading in GROUPS:
    assert body.count('### ' + sid + '.') == 1, sid
    body = body.replace('### ' + sid + '.', heading + '### ' + sid + '.', 1)

doc = HEAD + body.lstrip('\n')
OUT.write_text(doc, encoding='utf-8')
print(f'wrote {OUT.relative_to(REPO)}: {len(found)} screens, {len(doc.split()):,} words')
