"""Screen iterations for the MVP, in md.sgnk.ai's tokens.

The 23 existing mockups were drawn for the pre-reset product; nine of them show review
state, which now comes after the pilot. These cover the screens the MVP actually builds:
the launcher, the editor, the right rail, the AI surfaces and the kit page.

Each entry is {id, screen, name, why, card, cardq, html}. The html renders inside the
gallery's .stage, which already carries the tokens, so nothing here sets a colour by hand
except through var(--...).
"""
import json

def app(body, bar='frontmatter'):
    return f'<div class="app"><div class="bar"><span class="logo">{bar}</span></div>{body}</div>'

def tmpl(*names):
    cells = ''.join(f'<div class="tmpl">{n}</div>' for n in names)
    return ('<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0">'
            + cells + '</div>')

def rows(*pairs):
    return ''.join(
        f'<div class="row"><span>{a}</span><span style="color:var(--muted)">{b}</span></div>'
        for a, b in pairs)

TREE = ('<div class="tree"><div class="rh">Projects</div>'
        '<div class="row on"><span>booking app</span></div>'
        '<div class="row"><span style="padding-left:12px">00-BRIEF.md</span></div>'
        '<div class="row"><span style="padding-left:12px">01-PRODUCT.md</span></div>'
        '<div class="row"><span>notes</span></div></div>')

def rail(*items, head='This document'):
    body = ''.join(f'<div class="row"><span>{i}</span></div>' for i in items)
    return f'<div class="rail"><div class="rh">{head}</div>{body}</div>'

def tabs(active=0, coloured=False):
    names = ['00-BRIEF', '01-PRODUCT', 'notes']
    out = []
    for i, n in enumerate(names):
        cls = 'tab on' if i == active else 'tab'
        style = ''
        if coloured:
            c = ['var(--link)', 'var(--success)', 'var(--danger)'][i]
            style = f' style="border-bottom:2px solid {c}"'
        out.append(f'<span class="{cls}"{style}>{n}</span>')
    return '<div class="tabs">' + ''.join(out) + '</div>'

def modes(*names, on=0):
    return '<div class="modes">' + ''.join(
        f'<span class="mode{" on" if i == on else ""}">{n}</span>'
        for i, n in enumerate(names)) + '</div>'

DOC = ('<h2>Booking app brief</h2>'
       '<p style="color:var(--fg-muted);line-height:1.6">A small service that takes a slot, '
       'holds it for ten minutes, and confirms on payment. The first user is a studio owner '
       'with one room to let.</p>')

M = []
def add(i, screen, name, why, card, cardq, html):
    M.append({"id": i, "screen": screen, "name": name, "why": why,
              "card": card, "cardq": cardq, "html": html})

# ---- Launcher: what a template is (F27) ---------------------------------------
add("n01", "Launcher", "Templates are files you start from",
    "Plain and predictable. A template opens as a document you edit. It asks nothing of you, "
    "and it teaches nothing about the kit.",
    "F27", "Are the launcher's four templates files or generator prompts",
    app('<div class="body"><div class="doc"><h2>Start something</h2>'
        + tmpl('Blank document', 'Spec', 'Meeting note', 'Decision record')
        + '<div class="rh">Recent</div>'
        + rows(('booking-app/00-BRIEF.md', '2h'), ('notes/reading.md', 'yesterday'))
        + '</div></div>'))

add("n02", "Launcher", "The first template starts a project from a prompt",
    "The funnel is on the first screen. A stranger meets the thing that makes us different "
    "before they meet an empty page. The risk is that it reads as an AI toy.",
    "F27", "Are the launcher's four templates files or generator prompts",
    app('<div class="body"><div class="doc"><h2>Start something</h2>'
        '<div style="display:grid;gap:10px;margin:14px 0">'
        '<div class="tmpl" style="border-color:var(--border-strong)"><b>Start a project from a prompt</b>'
        '<div style="color:var(--fg-muted);font-size:12px;margin-top:4px">Describe it, answer a few '
        'questions, get a document set and a prompt for your coding agent</div></div></div>'
        + tmpl('Blank document', 'Spec', 'Meeting note', 'Decision record')
        + '</div></div>'))

add("n03", "Launcher", "Two ways in, kept apart",
    "A row for writing and a row for generating. Nobody has to work out which one they want, "
    "and the generator does not crowd the blank page.",
    "F27", "Are the launcher's four templates files or generator prompts",
    app('<div class="body"><div class="doc"><h2>Start something</h2>'
        '<div class="rh">Write</div>' + tmpl('Blank document', 'Meeting note')
        + '<div class="rh">Generate a project</div>'
        + tmpl('From a prompt', 'From a repository')
        + '</div></div>'))

# ---- Launcher: search (F25) ---------------------------------------------------
add("n04", "Launcher", "Search in the header, always there",
    "One place, on every screen. Costs a slot in the top bar and needs an index that works "
    "before the first document is open.",
    "F25", "Where the search index lives",
    app('<div class="body"><div class="doc">'
        '<div class="row" style="border:1px solid var(--border-strong);border-radius:var(--r);'
        'padding:8px 10px;margin-bottom:14px"><span style="color:var(--muted)">Search your documents</span>'
        '<span style="color:var(--muted)">/</span></div><h2>Recent</h2>'
        + rows(('booking-app/00-BRIEF.md', '2h'), ('notes/reading.md', 'yesterday'),
               ('booking-app/01-PRODUCT.md', '3d')) + '</div></div>',
        'frontmatter'))

add("n05", "Launcher", "Search is a shortcut, not a box",
    "Keeps the screen quiet. Cmd K opens it over whatever you are doing. People who do not "
    "know the shortcut never find it.",
    "F25", "Where the search index lives",
    app('<div class="body"><div class="doc"><h2>Start something</h2>'
        + tmpl('Blank document', 'Spec', 'Meeting note', 'Decision record')
        + '<div style="margin-top:18px;color:var(--muted);font-size:12px">Press '
        '<span class="pill">Cmd K</span> to search</div></div></div>'))

# ---- Editor: tabs (FF3-adjacent, shell identity) ------------------------------
add("n06", "Editor", "Plain tabs, as the shell ships today",
    "Nothing to build. The tab strip is the sibling's, unchanged, which is also the point of "
    "the fork question.",
    "FF3", "What to do about the shell being a fork",
    app('<div class="body">' + TREE + '<div class="doc">' + tabs() + DOC + '</div>'
        + rail('Outline', 'Tags', 'Bookmarks') + '</div>'))

add("n07", "Editor", "Coloured tabs, one per project",
    "You can tell two documents apart at a glance when six are open. It is the one visible "
    "difference from the sibling on the first screen.",
    "FF3", "What to do about the shell being a fork",
    app('<div class="body">' + TREE + '<div class="doc">' + tabs(coloured=True) + DOC + '</div>'
        + rail('Outline', 'Tags', 'Bookmarks') + '</div>'))

# ---- Editor: Tab key (D15) ----------------------------------------------------
add("n08", "Editor", "Tab indents the line",
    "What a writer expects in a markdown editor, and what every editor they came from does. "
    "It traps keyboard users who need Tab to move on.",
    "D15", "Does Tab indent in the editor, or move focus",
    app('<div class="body"><div class="doc">' + tabs()
        + '<p style="line-height:1.7">- a list item<br>'
        '<span style="padding-left:22px;background:var(--selected)">- indented by Tab</span></p>'
        '<div style="color:var(--muted);font-size:12px;margin-top:10px">Tab indents. '
        'Escape then Tab moves focus out.</div></div></div>'))

add("n09", "Editor", "Tab moves focus, Cmd bracket indents",
    "Keyboard users can always leave the editor. Every writer who types Tab gets a surprise "
    "the first time.",
    "D15", "Does Tab indent in the editor, or move focus",
    app('<div class="body"><div class="doc">' + tabs()
        + '<p style="line-height:1.7">- a list item<br>- another</p>'
        '<div style="color:var(--muted);font-size:12px;margin-top:10px">Tab leaves the editor. '
        '<span class="pill">Cmd ]</span> indents.</div></div></div>'))

# ---- Right rail: bookmarks and graph (F18) ------------------------------------
add("n10", "Right rail", "Everything stays, as it ships today",
    "No work. The rail carries six things and a stranger has to learn all of them before the "
    "one they wanted.",
    "F18", "Do bookmarks and graph view get deleted, demoted, or left",
    app('<div class="body">' + TREE + '<div class="doc">' + tabs() + DOC + '</div>'
        + rail('Outline', 'Tags', 'Bookmarks', 'Graph', 'History', 'Comments') + '</div>'))

add("n11", "Right rail", "Outline and history only, the rest in the palette",
    "Two things in the rail, the rest one keystroke away. The plan's own rule is one job per "
    "screen, and this is it applied.",
    "F18", "Do bookmarks and graph view get deleted, demoted, or left",
    app('<div class="body">' + TREE + '<div class="doc">' + tabs() + DOC + '</div>'
        + rail('Outline', 'History') + '</div>'))

add("n12", "Right rail", "Collapsed by default, opens on click",
    "The document gets the width. The rail is there when you want it and invisible when you "
    "do not. People may never open it.",
    "F18", "Do bookmarks and graph view get deleted, demoted, or left",
    app('<div class="body">' + TREE
        + '<div class="doc" style="flex:1">' + tabs() + DOC + '</div>'
        '<div class="rail" style="width:38px;text-align:center;color:var(--muted)">'
        '<div style="writing-mode:vertical-rl;padding:10px 0;font-size:11px">Outline</div></div></div>'))

# ---- AI: how many verbs (F8) --------------------------------------------------
add("n13", "AI panel", "Two verbs, as the plan specifies",
    "Fix this, or critique this. Two things to learn, and the panel fits on one line. Anything "
    "else the code already does becomes unreachable.",
    "F8", "Two verbs or the eight the code already has",
    app('<div class="body"><div class="doc">' + tabs() + DOC
        + '<div class="strip" style="margin-top:16px"><span class="pill">Fix this</span>'
        '<span class="pill">Critique this</span></div></div></div>'))

add("n14", "AI panel", "Eight verbs, grouped",
    "Everything the code can already do is reachable. It is a menu on the first screen, and "
    "the positioning says we hide AI until it is asked for.",
    "F8", "Two verbs or the eight the code already has",
    app('<div class="body"><div class="doc">' + tabs() + DOC
        + '<div class="strip" style="margin-top:16px;flex-wrap:wrap;gap:6px">'
        + ''.join(f'<span class="pill">{v}</span>' for v in
                  ['Fix', 'Critique', 'Summarise', 'Expand', 'Shorten', 'Rewrite',
                   'Translate', 'Explain'])
        + '</div></div></div>'))

# ---- AI: the hide switch (F9) -------------------------------------------------
add("n15", "AI panel", "One switch, and the surfaces go",
    "Flip it and no AI control appears anywhere. It is the promise in the positioning, kept "
    "literally, and it is easy to demonstrate.",
    "F9", "What the hide all AI switch actually hides",
    app('<div class="body"><div class="doc">' + tabs() + DOC
        + '<div style="margin-top:16px;color:var(--muted);font-size:12px">AI is off. No writing '
        'box, no edit menu, no suggestions.</div></div></div>'))

add("n16", "AI panel", "The switch hides the surfaces, the menu stays",
    "The feature is still discoverable for someone who wants it back. A person who turned it "
    "off still sees the word AI, which is the thing they objected to.",
    "F9", "What the hide all AI switch actually hides",
    app('<div class="body"><div class="doc">' + tabs() + DOC
        + '<div class="strip" style="margin-top:16px"><span class="pill" '
        'style="color:var(--muted)">AI is off</span></div></div></div>'))

# ---- Kit page: the funnel screen (G12) ----------------------------------------
add("n17", "Kit page", "The kit, with the prompt to copy",
    "One screen, one job: hand the work to an agent. The files are listed so a person can see "
    "what they are handing over.",
    "G12", "Do exported and shared pages carry a frontmatter mark",
    app('<div class="body"><div class="doc"><h2>Booking app</h2>'
        '<div style="color:var(--fg-muted);font-size:12px;margin-bottom:12px">Seven documents, '
        'version 1</div>'
        + rows(('00-BRIEF.md', '1.2 kB'), ('01-PRODUCT.md', '3.4 kB'),
               ('02-DATA-AND-API.md', '2.8 kB'), ('specs/booking.md', '1.9 kB'))
        + '<div class="dwhy" style="margin-top:14px"><b>Copy this into your agent</b>'
        '<div style="font-family:var(--font-mono,monospace);font-size:11px;margin-top:6px;'
        'color:var(--fg-muted)">mkdir -p docs/kit &amp;&amp; curl -sL .../kit.tar.gz | tar xz -C docs/kit</div>'
        '</div></div></div>'))

add("n18", "Kit page", "The kit, with a mark back to us",
    "Every shared kit carries a line home. It is the whole organic channel in the plan, and "
    "paying removes it.",
    "G12", "Do exported and shared pages carry a frontmatter mark",
    app('<div class="body"><div class="doc"><h2>Booking app</h2>'
        + rows(('00-BRIEF.md', '1.2 kB'), ('01-PRODUCT.md', '3.4 kB'))
        + '<div style="margin-top:18px;padding-top:10px;border-top:1px solid var(--border);'
        'color:var(--muted);font-size:12px">Made with frontmatter '
        '<span class="pill">Open in frontmatter</span></div></div></div>'))

add("n19", "Kit page", "No mark, and the link is bare",
    "Nothing about us on a page someone shares with their team. Cleaner for them, and the "
    "funnel loses its only free channel.",
    "G12", "Do exported and shared pages carry a frontmatter mark",
    app('<div class="body"><div class="doc"><h2>Booking app</h2>'
        + rows(('00-BRIEF.md', '1.2 kB'), ('01-PRODUCT.md', '3.4 kB'),
               ('02-DATA-AND-API.md', '2.8 kB'))
        + '</div></div>', 'booking app'))

# ---- Editor: what the first thirty seconds is (FL3) ---------------------------
add("n20", "Editor", "Toolbar visible, everything within reach",
    "A stranger can bold a word without knowing markdown. It is a row of controls on a screen "
    "whose whole claim is that it stays out of the way.",
    "FL3", "Do the table stakes interaction days go into the pilot",
    app('<div class="body">' + TREE + '<div class="doc">' + tabs()
        + '<div class="strip" style="margin-bottom:10px">'
        + ''.join(f'<span class="pill">{v}</span>' for v in ['B', 'I', 'Link', 'List', 'Code', 'Export'])
        + '</div>' + DOC + '</div>' + rail('Outline', 'History') + '</div>'))

add("n21", "Editor", "No toolbar, shortcuts and the palette",
    "The document is the screen. Everything is a keystroke, and a stranger who does not know "
    "markdown has nothing to click.",
    "FL3", "Do the table stakes interaction days go into the pilot",
    app('<div class="body">' + TREE + '<div class="doc">' + tabs() + DOC
        + '<div style="margin-top:14px;color:var(--muted);font-size:12px">'
        '<span class="pill">Cmd K</span> for everything</div></div>'
        + rail('Outline', 'History') + '</div>'))

print('window.MVP_MOCKUPS = ' + json.dumps(M, indent=1, ensure_ascii=False) + ';')
