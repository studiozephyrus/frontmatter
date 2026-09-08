/* frontmatter decisions — the app.
   Data comes from window.QUESTIONS (an array in the tred decisions schema).
   Answers persist to localStorage. Everything is a projection of that array:
   nav, overview, the card, the pager and the export are all derived, never stored.

   The markdown importer is the sidecar feature: paste or drop a decision file and
   it becomes questions in the same schema, without a server. */
(function () {
  'use strict';

  var Q = (window.QUESTIONS || []).slice();
  var KEY = 'fm-decisions-v1';
  var state = load();
  var view = { mode: 'overview', id: null, cat: null, filter: '' };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { picks: {}, notes: {} }; }
    catch (e) { return { picks: {}, notes: {} }; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  /* the only inline markdown we honour, so a question can emphasise a number */
  var md = function (s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`([^`]+?)`/g, '<code class="mono">$1</code>')
      .replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<i>$2</i>');
  };
  var icon = function (n) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };

  function cats() {
    var seen = {}, out = [];
    Q.forEach(function (q) {
      if (!seen[q.cat]) { seen[q.cat] = { cat: q.cat, qs: [] }; out.push(seen[q.cat]); }
      seen[q.cat].qs.push(q);
    });
    return out;
  }
  var answered = function (list) {
    return list.filter(function (q) { return state.picks[q.id]; }).length;
  };
  var crit = function (list) {
    return list.filter(function (q) { return q.weight === 'critical' && !state.picks[q.id]; }).length;
  };
  var match = function (q, f) {
    if (!f) return true;
    f = f.toLowerCase();
    return (q.id + ' ' + q.q + ' ' + q.cat + ' ' + (q.sub || '') + ' ' + (q.lede || '')).toLowerCase().indexOf(f) > -1;
  };

  /* ── nav ──────────────────────────────────────────────────────────────── */
  function renderNav() {
    var f = view.filter, groups = cats(), h = '';
    h += '<div class="nsearch"><input id="navsearch" type="search" placeholder="Search questions" ' +
      'value="' + esc(f) + '" aria-label="Search questions"></div>';
    h += '<button class="navcat' + (view.mode === 'overview' ? ' on' : '') + '" data-ov="1">' +
      '<span class="nl">Overview</span><span class="np">' + answered(Q) + '/' + Q.length + '</span><span></span></button>';
    h += '<button class="navcat' + (view.mode === 'import' ? ' on' : '') + '" data-import="1">' +
      '<span class="nl">Import markdown</span><span class="np">sidecar</span><span></span></button>';
    groups.forEach(function (g) {
      var qs = g.qs.filter(function (q) { return match(q, f); });
      if (!qs.length) return;
      var a = answered(g.qs), c = crit(g.qs), pct = g.qs.length ? (a / g.qs.length) * 100 : 0;
      h += '<button class="navcat" data-cat="' + esc(g.cat) + '">' +
        '<span class="nl">' + esc(g.cat) + '</span>' +
        (c ? '<span class="ncrit" title="' + c + ' critical unanswered">' + c + '</span>' : '<span></span>') +
        '<span class="np">' + a + '/' + g.qs.length + '</span>' +
        '<span class="nbar"><i style="width:' + pct + '%"></i></span></button>';
      var open = view.cat === g.cat || f;
      if (open) qs.forEach(function (q) {
        h += '<button class="navq' + (view.id === q.id ? ' on' : '') +
          (state.picks[q.id] ? ' done' : '') + (q.weight === 'critical' ? ' crit' : '') +
          '" data-q="' + esc(q.id) + '"><span class="qid">' + esc(q.id) + '</span>' +
          '<span class="qt">' + esc(q.q) + '</span><span class="dot"></span></button>';
      });
    });
    $('#nav').innerHTML = h;
  }

  /* ── evidence ─────────────────────────────────────────────────────────── */
  function evBlock(b) {
    var h = '<div class="evb"><div class="evt">' + md(b.title || '') + '</div>' +
      (b.note ? '<div class="evn">' + md(b.note) + '</div>' : '');
    if (b.type === 'table' && b.rows) {
      h += '<div style="overflow-x:auto"><table class="d">';
      if (b.cols) h += '<thead><tr>' + b.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead>';
      h += '<tbody>' + b.rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + md(c) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    } else if (b.type === 'stat' && b.items) {
      h += b.items.map(function (it) {
        return '<div class="statrow"><span>' + md(it[0]) + '</span><b>' + md(it[1] || '') + '</b>' +
          '<span class="sn">' + md(it[2] || '') + '</span></div>';
      }).join('');
    } else if (b.type === 'bars' && b.data) {
      var max = Math.max.apply(null, b.data.map(function (d) { return Math.abs(Number(d[1])) || 0; })) || 1;
      h += b.data.map(function (d) {
        var v = Number(d[1]) || 0, w = (Math.abs(v) / max) * 100;
        var thr = b.threshold != null ? (Math.abs(b.threshold) / max) * 100 : null;
        return '<div class="brow"><span>' + esc(d[0]) + '</span>' +
          '<span class="btrack"><i style="width:' + w + '%"></i>' +
          (thr != null ? '<span class="thr" style="left:' + thr + '%" title="' + esc(b.thresholdLabel || 'threshold') + '"></span>' : '') +
          '</span><span class="bv">' + v + (b.unit ? ' ' + esc(b.unit) : '') + '</span></div>';
      }).join('');
    }
    return h + '</div>';
  }

  /* ── the question ─────────────────────────────────────────────────────── */
  function renderQ(q) {
    var idx = Q.indexOf(q), prev = Q[idx - 1], next = Q[idx + 1], pick = state.picks[q.id];
    var wc = q.weight === 'critical' ? 'crit' : q.weight === 'high' ? 'high' : '';
    var h = '';
    h += '<div class="qhead"><span class="chip mono">' + esc(q.id) + '</span>' +
      '<span class="chip">' + esc(q.cat) + (q.sub ? ' · ' + esc(q.sub) : '') + '</span>' +
      (q.weight ? '<span class="chip ' + wc + '">' + esc(q.weight) + '</span>' : '') +
      (pick ? '<span class="chip done">answered ' + esc(pick).toUpperCase() + '</span>' : '') + '</div>';
    h += '<h1 class="q">' + md(q.q) + '</h1>';
    if (q.lede) h += '<p class="lede">' + md(q.lede) + '</p>';

    h += '<div class="ctx">' +
      '<div class="ctxc"><span class="k">Where it stands</span><p>' + md(q.now || '—') + '</p></div>' +
      '<div class="ctxc"><span class="k">How it got here</span><p>' + md(q.why || '—') + '</p></div>' +
      '<div class="ctxc problem"><span class="k">The tension</span><p>' + md(q.problem || '—') + '</p></div></div>';

    if (q.evidence && q.evidence.length) {
      h += '<details class="ev"><summary>' + icon('bar_chart') + 'Evidence' +
        '<span class="cnt">' + q.evidence.length + ' ' + (q.evidence.length === 1 ? 'exhibit' : 'exhibits') + '</span></summary>' +
        '<div class="evbody">' + q.evidence.map(evBlock).join('') + '</div></details>';
    }

    h += '<div class="opts" role="radiogroup" aria-label="Options">';
    (q.options || []).forEach(function (o) {
      h += '<button class="opt' + (o.k === q.rec ? ' rec' : '') + (pick === o.k ? ' on' : '') +
        '" data-pick="' + esc(o.k) + '" role="radio" aria-checked="' + (pick === o.k) + '">' +
        '<span class="k">' + esc(o.k) + '</span><span><span class="ol">' + md(o.label) +
        (o.k === q.rec ? '<span class="rectag">recommended</span>' : '') + '</span>' +
        '<span class="oi">' + md(o.impact || '') + '</span></span></button>';
    });
    h += '</div>';

    if (q.recCase) h += '<div class="reccase"><b>Why ' + esc(String(q.rec).toUpperCase()) + '.</b> ' + md(q.recCase) + '</div>';

    h += '<textarea class="note" id="note" placeholder="Your note on this decision (saved locally)">' +
      esc(state.notes[q.id] || '') + '</textarea>';

    if (q.sources && q.sources.length) {
      h += '<div style="margin-top:14px">' + q.sources.map(function (s) {
        return '<span class="srcpill">' + esc(s) + '</span>';
      }).join('') + '</div>';
    }

    h += '<div class="pager">';
    h += prev ? '<button class="pg" data-q="' + esc(prev.id) + '"><span class="pk">' + icon('arrow_back') +
      ' Previous</span><span class="pt">' + esc(prev.q) + '</span></button>' : '<span></span>';
    h += next ? '<button class="pg next" data-q="' + esc(next.id) + '"><span class="pk">Next ' +
      icon('arrow_forward') + '</span><span class="pt">' + esc(next.q) + '</span></button>' : '<span></span>';
    h += '</div>';
    $('#main').innerHTML = h;
    $('#main').scrollTop = 0;

    /* right rail: where this question came from */
    var rail = '<div class="rsec"><div class="rh">This decision</div>' +
      '<div class="rlink"><span class="rm">Weight</span>' + esc(q.weight || '—') + '</div>' +
      '<div class="rlink"><span class="rm">Area</span>' + esc(q.cat) + '</div>' +
      (q.sub ? '<div class="rlink"><span class="rm">Group</span>' + esc(q.sub) + '</div>' : '') + '</div>';
    if (q.sources && q.sources.length) {
      rail += '<div class="rsec"><div class="rh">Sources</div>' +
        q.sources.map(function (s) { return '<div class="rlink">' + esc(s) + '</div>'; }).join('') + '</div>';
    }
    var same = Q.filter(function (o) { return o.cat === q.cat && o.id !== q.id; }).slice(0, 8);
    if (same.length) {
      rail += '<div class="rsec"><div class="rh">Also in ' + esc(q.cat) + '</div>' +
        same.map(function (o) {
          return '<button class="rlink" data-q="' + esc(o.id) + '" style="text-align:left;width:100%">' +
            '<span class="rm">' + esc(o.id) + (state.picks[o.id] ? ' · answered' : '') + '</span>' + esc(o.q) + '</button>';
        }).join('') + '</div>';
    }
    $('#aside').innerHTML = rail;
    $('#abarPos').textContent = (idx + 1) + ' / ' + Q.length;
    $('#abarPrev').disabled = !prev; $('#abarNext').disabled = !next;
  }

  /* ── overview ─────────────────────────────────────────────────────────── */
  function renderOverview() {
    var groups = cats(), a = answered(Q), c = crit(Q);
    var h = '<h1 class="q">Decisions pending on frontmatter</h1>' +
      '<p class="lede">' + Q.length + ' decisions drawn from two weeks of research: two verification rounds, ' +
      'a gap register and an adversarial round that came back against the plan\'s own headline. ' +
      'Each one states where it stands, how it got there, the tension, the evidence, and a recommendation. ' +
      'Answers are saved in this browser only.</p>';
    h += '<div class="ctx"><div class="ctxc"><span class="k">Answered</span><p>' + a + ' of ' + Q.length + '</p></div>' +
      '<div class="ctxc"><span class="k">Critical open</span><p>' + c + '</p></div>' +
      '<div class="ctxc problem"><span class="k">Areas</span><p>' + groups.length + '</p></div></div>';
    h += '<div class="grid">' + groups.map(function (g) {
      var ga = answered(g.qs), gc = crit(g.qs), pct = g.qs.length ? (ga / g.qs.length) * 100 : 0;
      return '<button class="card" data-cat="' + esc(g.cat) + '">' +
        '<div class="ct">' + esc(g.cat) + '</div>' +
        '<div class="cs">' + ga + ' of ' + g.qs.length + ' answered' + (gc ? ' · ' + gc + ' critical open' : '') + '</div>' +
        '<div class="cbar"><i style="width:' + pct + '%"></i></div></button>';
    }).join('') + '</div>';
    var openCrit = Q.filter(function (q) { return q.weight === 'critical' && !state.picks[q.id]; }).slice(0, 12);
    if (openCrit.length) {
      h += '<h2 style="font-size:16px;margin:22px 0 8px">Start here — critical and unanswered</h2>';
      h += openCrit.map(function (q) {
        return '<button class="card" style="margin-bottom:7px;width:100%" data-q="' + esc(q.id) + '">' +
          '<div class="cs mono">' + esc(q.id) + ' · ' + esc(q.cat) + '</div>' +
          '<div class="ct" style="margin-top:3px">' + esc(q.q) + '</div></button>';
      }).join('');
    }
    $('#main').innerHTML = h; $('#main').scrollTop = 0;
    $('#aside').innerHTML = '<div class="rsec"><div class="rh">Export</div>' +
      '<button class="rlink" id="expMd" style="text-align:left;width:100%">Answers as markdown</button>' +
      '<button class="rlink" id="expJson" style="text-align:left;width:100%">Answers as JSON</button></div>' +
      '<div class="rsec"><div class="rh">Keyboard</div>' +
      '<div class="rlink"><span class="kbd">j</span> <span class="kbd">k</span> next / previous</div>' +
      '<div class="rlink"><span class="kbd">a</span>–<span class="kbd">d</span> pick an option</div>' +
      '<div class="rlink"><span class="kbd">/</span> search</div></div>';
    $('#abarPos').textContent = a + ' / ' + Q.length;
  }

  /* ── markdown import — the sidecar ───────────────────────────────────── */
  function renderImport() {
    $('#main').innerHTML =
      '<h1 class="q">Import a decision file</h1>' +
      '<p class="lede">Paste or drop a markdown file and it becomes decision cards. ' +
      'This is the sidecar in miniature: the file stays the source, the page is a projection of it. ' +
      'Nothing is uploaded — parsing happens in this browser.</p>' +
      '<div class="drop" id="drop">Drop a <b>.md</b> file here, or paste below</div>' +
      '<textarea class="mdin" id="mdin" style="margin-top:12px" placeholder="' + esc(
        '## Should we ship the VS Code extension first?\n' +
        '- cat: Form factor\n' +
        '- weight: critical\n' +
        '> An extension can write byte-exactly; the standalone shell is a fork.\n' +
        '\n' +
        'now: The plan builds a standalone editor.\n' +
        'why: Never weighed against the alternative.\n' +
        'problem: The buyer lives in VS Code.\n' +
        '\n' +
        '- [ ] a. Standalone only — keeps the byte promise entirely ours\n' +
        '- [x] b. Extension first — meets the buyer where they are\n' +
        '- [ ] c. Both from one core — two shells, one engine\n'
      ) + '"></textarea>' +
      '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="tbtn primary" id="mdgo">' + icon('add') + 'Render as decisions</button>' +
      '<button class="tbtn" id="mdsample">Load the example</button></div>' +
      '<div id="mdout" style="margin-top:18px"></div>';
    $('#aside').innerHTML = '<div class="rsec"><div class="rh">Format</div>' +
      '<div class="rlink"><span class="rm">##</span> the question</div>' +
      '<div class="rlink"><span class="rm">- key: value</span> cat, sub, weight, id</div>' +
      '<div class="rlink"><span class="rm">&gt;</span> the lede</div>' +
      '<div class="rlink"><span class="rm">now: why: problem:</span> context</div>' +
      '<div class="rlink"><span class="rm">- [ ] a. label — impact</span> an option</div>' +
      '<div class="rlink"><span class="rm">- [x]</span> marks the recommendation</div></div>';
  }

  /* Parse a decision markdown file. Deliberately forgiving: anything it cannot
     place becomes part of the lede rather than being dropped. */
  function parseMd(text) {
    var out = [], cur = null, n = 0;
    text.split(/\r?\n/).forEach(function (line) {
      var m;
      if ((m = line.match(/^#{1,3}\s+(.*)$/))) {
        if (cur) out.push(cur);
        n++;
        cur = { id: 'IM' + n, cat: 'Imported', sub: '', weight: 'medium', q: m[1].trim(),
                lede: '', now: '', why: '', problem: '', evidence: [], options: [], rec: '', recCase: '' };
        return;
      }
      if (!cur) return;
      if ((m = line.match(/^\s*[-*]\s*\[([ xX])\]\s*([a-dA-D])[.)]?\s*(.*)$/))) {
        var parts = m[3].split(/\s+[—–]\s+/);
        var k = m[2].toLowerCase();
        cur.options.push({ k: k, label: parts[0].trim(), impact: (parts[1] || '').trim() });
        if (m[1].toLowerCase() === 'x') cur.rec = k;
        return;
      }
      if ((m = line.match(/^\s*[-*]\s*(cat|sub|weight|id|rec)\s*:\s*(.+)$/i))) {
        /* a pasted file must not be able to inject an attribute: ids are
           restricted to word characters, everything else is plain text that
           only ever reaches the DOM through esc() or md(). */
        var key = m[1].toLowerCase(), val = m[2].trim();
        cur[key] = key === 'id' ? val.replace(/[^\w.-]/g, '').slice(0, 24) || cur.id : val;
        return;
      }
      if ((m = line.match(/^\s*(now|why|problem|reccase|rec case)\s*:\s*(.+)$/i))) {
        var k2 = m[1].toLowerCase().replace(/\s/g, '');
        cur[k2 === 'reccase' ? 'recCase' : k2] = m[2].trim(); return;
      }
      if ((m = line.match(/^\s*>\s?(.*)$/))) { cur.lede += (cur.lede ? ' ' : '') + m[1].trim(); return; }
      if (line.trim() && !cur.now && !cur.options.length) cur.lede += (cur.lede ? ' ' : '') + line.trim();
    });
    if (cur) out.push(cur);
    return out.filter(function (q) { return q.q; });
  }

  function doImport() {
    var text = $('#mdin').value;
    var parsed = parseMd(text);
    var out = $('#mdout');
    if (!parsed.length) { out.innerHTML = '<div class="drop">Nothing to render. A question is a line starting with <b>##</b>.</div>'; return; }
    out.innerHTML = '<div class="card" style="border-color:var(--accent)"><div class="ct">' + parsed.length +
      ' question' + (parsed.length === 1 ? '' : 's') + ' parsed</div><div class="cs">' +
      parsed.map(function (p) { return esc(p.q); }).join(' · ') + '</div></div>' +
      '<div style="margin-top:10px"><button class="tbtn primary" id="mdadd">Add to this session</button></div>';
    $('#mdadd').onclick = function () {
      parsed.forEach(function (p) { if (!Q.some(function (x) { return x.id === p.id; })) Q.push(p); });
      view = { mode: 'q', id: parsed[0].id, cat: 'Imported', filter: '' };
      renderNav(); renderQ(parsed[0]);
    };
  }

  /* ── export ───────────────────────────────────────────────────────────── */
  function exportMd() {
    var lines = ['# frontmatter — decisions', '', 'Answered ' + answered(Q) + ' of ' + Q.length + '.', ''];
    cats().forEach(function (g) {
      var done = g.qs.filter(function (q) { return state.picks[q.id]; });
      if (!done.length) return;
      lines.push('## ' + g.cat, '');
      done.forEach(function (q) {
        var o = (q.options || []).filter(function (x) { return x.k === state.picks[q.id]; })[0];
        lines.push('### ' + q.id + ' — ' + q.q);
        lines.push('**Decision:** ' + (o ? o.label : state.picks[q.id]) +
          (state.picks[q.id] === q.rec ? ' (the recommendation)' : ' (against the recommendation of ' + String(q.rec).toUpperCase() + ')'));
        if (state.notes[q.id]) lines.push('', state.notes[q.id]);
        lines.push('');
      });
    });
    var open = Q.filter(function (q) { return !state.picks[q.id]; });
    if (open.length) {
      lines.push('## Still open', '');
      open.forEach(function (q) { lines.push('- **' + q.id + '** ' + q.q + (q.weight === 'critical' ? ' _(critical)_' : '')); });
    }
    download('frontmatter-decisions.md', lines.join('\n'), 'text/markdown');
  }
  function download(name, body, type) {
    var b = new Blob([body], { type: type });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }

  /* ── routing ──────────────────────────────────────────────────────────── */
  function go(v) {
    view = Object.assign({}, view, v);
    document.body.classList.remove('navopen');
    if (view.mode === 'q') {
      var q = Q.filter(function (x) { return x.id === view.id; })[0];
      if (!q) { view.mode = 'overview'; return go({}); }
      view.cat = q.cat; renderQ(q);
      location.hash = '#' + q.id;
    } else if (view.mode === 'import') { renderImport(); location.hash = '#import'; }
    else { renderOverview(); location.hash = '#overview'; }
    renderNav(); progress();
  }
  function progress() {
    var a = answered(Q), pct = Q.length ? (a / Q.length) * 100 : 0;
    $('#prog').style.width = pct + '%';
    $('#progtxt').textContent = a + ' / ' + Q.length + ' answered';
  }

  /* ── events ───────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-q],[data-cat],[data-ov],[data-import],[data-pick],#expMd,#expJson,#mdgo,#mdsample,#menuBtn,#themeBtn,#abarPrev,#abarNext');
    if (!t) return;
    if (t.id === 'menuBtn') { document.body.classList.toggle('navopen'); return; }
    if (t.id === 'themeBtn') { theme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); return; }
    if (t.id === 'expMd') { exportMd(); return; }
    if (t.id === 'expJson') { download('frontmatter-decisions.json', JSON.stringify(state, null, 2), 'application/json'); return; }
    if (t.id === 'mdgo') { doImport(); return; }
    if (t.id === 'mdsample') { $('#mdin').value = $('#mdin').placeholder; doImport(); return; }
    if (t.id === 'abarPrev' || t.id === 'abarNext') { step(t.id === 'abarNext' ? 1 : -1); return; }
    if (t.hasAttribute('data-pick')) {
      var q = Q.filter(function (x) { return x.id === view.id; })[0];
      if (!q) return;
      state.picks[q.id] = t.getAttribute('data-pick'); save(); renderQ(q); renderNav(); progress(); return;
    }
    if (t.hasAttribute('data-q')) { go({ mode: 'q', id: t.getAttribute('data-q') }); return; }
    if (t.hasAttribute('data-cat')) {
      var c = t.getAttribute('data-cat');
      var first = Q.filter(function (x) { return x.cat === c; })[0];
      view.cat = view.cat === c && view.mode === 'q' ? null : c;
      if (first) go({ mode: 'q', id: first.id }); else renderNav();
      return;
    }
    if (t.hasAttribute('data-ov')) { go({ mode: 'overview', id: null }); return; }
    if (t.hasAttribute('data-import')) { go({ mode: 'import', id: null }); return; }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'navsearch') { view.filter = e.target.value; renderNav(); var s = $('#navsearch'); if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); } }
    if (e.target.id === 'note' && view.id) { state.notes[view.id] = e.target.value; save(); }
  });

  function step(d) {
    var i = Q.findIndex(function (x) { return x.id === view.id; });
    if (i < 0) { if (Q.length) go({ mode: 'q', id: Q[0].id }); return; }
    var n = Q[i + d]; if (n) go({ mode: 'q', id: n.id });
  }
  document.addEventListener('keydown', function (e) {
    if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName) || e.metaKey || e.ctrlKey) return;
    if (e.key === '/') { e.preventDefault(); var s = $('#navsearch'); if (s) { document.body.classList.add('navopen'); s.focus(); } return; }
    if (e.key === 'j') { e.preventDefault(); step(1); return; }
    if (e.key === 'k') { e.preventDefault(); step(-1); return; }
    if (view.mode === 'q' && /^[a-d]$/.test(e.key)) {
      var q = Q.filter(function (x) { return x.id === view.id; })[0];
      if (q && (q.options || []).some(function (o) { return o.k === e.key; })) {
        state.picks[q.id] = e.key; save(); renderQ(q); renderNav(); progress();
      }
    }
  });

  /* drag and drop a markdown file anywhere on the import screen */
  ['dragover', 'drop', 'dragleave'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      var d = $('#drop'); if (!d) return;
      e.preventDefault();
      if (ev === 'dragover') d.classList.add('over');
      else d.classList.remove('over');
      if (ev === 'drop' && e.dataTransfer && e.dataTransfer.files[0]) {
        var r = new FileReader();
        r.onload = function () { $('#mdin').value = r.result; doImport(); };
        r.readAsText(e.dataTransfer.files[0]);
      }
    });
  });

  function theme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('fm-theme', t); } catch (e) {}
    var b = $('#themeBtn'); if (b) b.innerHTML = t === 'dark' ? icon('light_mode') : icon('dark_mode');
  }

  /* ── boot ─────────────────────────────────────────────────────────────── */
  try { var saved = localStorage.getItem('fm-theme'); if (saved) theme(saved); else theme(matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'); } catch (e) { theme('light'); }
  var h = (location.hash || '').replace('#', '');
  if (h && h !== 'overview' && h !== 'import' && Q.some(function (x) { return x.id === h; })) go({ mode: 'q', id: h });
  else if (h === 'import') go({ mode: 'import' });
  else go({ mode: 'overview' });
  window.addEventListener('hashchange', function () {
    var id = (location.hash || '').replace('#', '');
    if (id && id !== view.id && Q.some(function (x) { return x.id === id; })) go({ mode: 'q', id: id });
  });
})();
