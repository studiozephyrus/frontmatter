/* frontmatter decisions — the app.
   Data comes from window.QUESTIONS (an array in the tred decisions schema).
   Answers persist to localStorage. Everything is a projection of that array:
   nav, overview, the card, the pager and the export are all derived, never stored.

   The markdown importer is the sidecar feature: paste or drop a decision file and
   it becomes questions in the same schema, without a server. */
(function () {
  'use strict';

  /* A card tagged `task` is something somebody does, not something anybody chooses between.
     It stays in the data so the record is intact, but it is not a decision, so it is out of
     the count, the numbering, the search and the answer flow. It renders as a chore list on
     the overview instead. */
  var ALL = (window.QUESTIONS || []).slice();
  var CHORES = ALL.filter(function (q) { return q.when === 'task'; });
  var Q = ALL.filter(function (q) { return q.when !== 'task'; });
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
  var icon = function (n, cls) {
    return '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
  };
  /* The point at which a card needs an answer, set per card by the 2026-09-13 triage. A card
     without `when` makes no claim, and the page falls back to ordering by weight. */
  var WHEN = { mvp: 'Answer now, it blocks the MVP', beta: 'Beta slot in the pilot',
    after: 'After the pilot', notnow: 'Not now', task: 'A task, not a decision' };
  var WHEN_ORDER = ['mvp', 'beta', 'after', 'notnow'];
  var RANK = { critical: 0, high: 1, medium: 2 };

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
    return (q.id + ' ' + q.q + ' ' + q.cat + ' ' + (q.sub || '') + ' ' + (q.lede || '') + ' ' +
      (WHEN[q.when] || '')).toLowerCase().indexOf(f) > -1;
  };

  /* ── nav ──────────────────────────────────────────────────────────────── */
  /* The nav is the hot path: go() runs on every j/k, every next/prev and every
     answer, and this used to rebuild all ~200 rows with one innerHTML write —
     destroying and reparsing the whole subtree, including the search input,
     which is why typing needed a focus+setSelectionRange restore afterwards.

     Split in two:
       renderNav()  rebuilds the LIST, and only when its shape actually changes
                    (filter or open area). The search field lives outside it and
                    is never destroyed.
       syncNav()    the common case — the selected id moved, or an answer landed.
                    Touches classes and counters only. No parsing, no layout of
                    new nodes, no lost caret. */
  var navShape = null, searchT = null;

  function navShell() {
    var n = $('#nav');
    if (n.firstChild && $('#navsearch')) return;
    n.innerHTML = '<div class="nsearch"><div class="field">' + icon('search') +
      '<input id="navsearch" type="search" placeholder="Search ' + Q.length + ' decisions" ' +
      'value="' + esc(view.filter) + '" aria-label="Search questions"></div></div>' +
      '<div id="navlist"></div>';
  }

  function syncNav() {
    var list = $('#navlist');
    if (!list) return false;
    var i, el, els = list.querySelectorAll('.navq');
    for (i = 0; i < els.length; i++) {
      el = els[i];
      var id = el.getAttribute('data-q');
      el.classList.toggle('on', id === view.id);
      var done = !!state.picks[id];
      el.classList.toggle('done', done);
      el.classList.toggle('open', !done);
    }
    els = list.querySelectorAll('.navcat');
    for (i = 0; i < els.length; i++) {
      el = els[i];
      var c = el.getAttribute('data-cat');
      if (c == null) {
        el.classList.toggle('on',
          (el.hasAttribute('data-ov') && view.mode === 'overview') ||
          (el.hasAttribute('data-import') && view.mode === 'import'));
        continue;
      }
      el.classList.toggle('on', view.cat === c);
      var g = Q.filter(function (x) { return x.cat === c; });
      var a = answered(g), cr = crit(g);
      var np = el.querySelector('.np'); if (np) np.textContent = a + '/' + g.length;
      var nc = el.querySelector('.ncrit');
      if (nc) { nc.textContent = cr; nc.style.display = cr ? '' : 'none'; }
      var bar = el.querySelector('.nbar i');
      if (bar) bar.style.width = (g.length ? (a / g.length) * 100 : 0) + '%';
    }
    var ov = list.querySelector('[data-ov] .np');
    if (ov) ov.textContent = answered(Q) + '/' + Q.length;
    return true;
  }

  /* Cheap when nothing structural moved, full rebuild when it did. */
  function paintNav() {
    var shape = (view.filter || '') + '\u0000' + (view.mode === 'q' || view.mode === 'area' ? (view.cat || '') : '\u0000' + view.mode);
    if (shape === navShape && syncNav()) return;
    navShape = shape;
    renderNav();
  }

  function renderNav() {
    var f = view.filter, groups = cats(), h = '';
    navShell();
    h += '<div class="nsec">';
    h += '<button class="navcat' + (view.mode === 'overview' ? ' on' : '') + '" data-ov="1">' +
      '<span class="nl">Overview</span><span class="nmeta"><span class="np">' + answered(Q) + '/' + Q.length + '</span></span></button>';
    h += '<button class="navcat' + (view.mode === 'import' ? ' on' : '') + '" data-import="1">' +
      '<span class="nl">Import markdown</span><span class="nmeta"><span class="np">local</span></span></button>';
    h += '</div>';
    groups.forEach(function (g) {
      var qs = g.qs.filter(function (q) { return match(q, f); });
      if (!qs.length) return;
      var a = answered(g.qs), c = crit(g.qs), pct = g.qs.length ? (a / g.qs.length) * 100 : 0;
      h += '<button class="navcat' + (view.cat === g.cat ? ' on' : '') + '" data-cat="' + esc(g.cat) + '">' +
        '<span class="nl">' + esc(g.cat) + '</span><span class="nmeta">' +
        (c ? '<span class="ncrit" title="' + c + ' critical unanswered">' + c + '</span>' : '') +
        '<span class="np">' + a + '/' + g.qs.length + '</span></span>' +
        '<span class="nbar"><i style="width:' + pct + '%"></i></span></button>';
      var open = view.cat === g.cat || f;
      if (open) qs.forEach(function (q) {
        h += '<button class="navq' + (view.id === q.id ? ' on' : '') +
          (state.picks[q.id] ? ' done' : ' open') +
          (q.weight === 'critical' ? ' crit' : q.weight === 'high' ? ' high' : '') +
          '" data-q="' + esc(q.id) + '"><span class="dot"></span>' +
          '<span class="qt">' + esc(q.q) + '</span></button>';
      });
    });
    $('#navlist').innerHTML = h;
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
          (it[2] ? '<span class="sn">' + md(it[2]) + '</span>' : '') + '</div>';
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
  /* A decision is only useful if the reader can see the thing being decided. The v2
     shape leads with a diagram, states the context as bullets rather than paragraphs,
     and gives every option its own gains, costs, system effect and screen effect, so
     choosing does not mean holding four paragraphs in your head at once. v1 questions
     — paragraph now/why/problem, options carrying a single impact string — still
     render, so the corpus can migrate one question at a time. */
  function bullets(v, cls) {
    if (!v) return '';
    var arr = Array.isArray(v) ? v : [v];
    if (!arr.length) return '';
    return '<ul class="' + (cls || 'bl') + '">' +
      arr.map(function (b) { return '<li>' + md(b) + '</li>'; }).join('') + '</ul>';
  }

  function renderQ(q) {
    var idx = Q.indexOf(q), prev = Q[idx - 1], next = Q[idx + 1], pick = state.picks[q.id];
    var wc = q.weight === 'critical' ? 'crit' : q.weight === 'high' ? 'high' : '';
    var inCat = Q.filter(function (x) { return x.cat === q.cat; });
    var catIdx = inCat.indexOf(q) + 1;
    var h = '';

    h += '<div class="card-q w-' + esc(q.weight || 'medium') + '">';
    h += '<div class="pos"><span class="eyebrow">Decision ' + (idx + 1) + ' of ' + Q.length + '</span>' +
      '<span class="dotsep">\u00b7</span><span class="eyebrow">' + esc(q.cat) + ' ' + catIdx + '/' + inCat.length + '</span></div>';
    h += '<div class="qhead"><span class="pill id">' + esc(q.id) + '</span>' +
      '<span class="pill">' + esc(q.cat) + (q.sub ? ' \u00b7 ' + esc(q.sub) : '') + '</span>' +
      (q.weight && q.weight !== 'medium' ? '<span class="pill ' + wc + '">' + esc(q.weight) + '</span>' : '') +
      (WHEN[q.when] ? '<span class="pill when when-' + esc(q.when) + '">' + esc(WHEN[q.when]) + '</span>' : '') +
      (pick ? '<span class="pill done">' + icon('check') + ' answered ' + esc(pick).toUpperCase() + '</span>' : '') + '</div>';
    h += '<h1 class="q">' + md(q.q) + '</h1>';
    if (q.lede) h += '<p class="lede">' + md(q.lede) + '</p>';

    if (q.visual && window.Diagram) h += window.Diagram.render(q.visual);

    if (q.stakes) h += '<div class="stakes">' + icon('warning', 'si') +
      '<span><b>If this goes the wrong way.</b> ' + md(q.stakes) + '</span></div>';

    /* Cards whose answer changes this one's options. Shown before the options, not after,
       because the point is to answer them first. */
    var first = (q.dependsOn || []).filter(function (id) { return Q.some(function (x) { return x.id === id; }); });
    if (first.length) {
      h += '<div class="linked first"><span class="eyebrow">Answer these first</span><span class="lchips">' +
        first.map(function (id) {
          var t = Q.filter(function (x) { return x.id === id; })[0];
          return '<button class="lchip' + (state.picks[id] ? ' done' : '') + '" data-q="' + esc(id) + '"><b>' +
            esc(id) + '</b> ' + esc(t.q) + (state.picks[id] ? ' (answered)' : '') + '</button>';
        }).join('') + '</span></div>';
    }

      /* `path` was deleted from every card in the 2026-09-10 compaction, so this renders only the
         blocks that carry something. An empty "How it got here" column would show an em dash on
         all 264 cards and waste a third of the row. `.ctx` is auto-fit, so it rebalances itself. */
      var sV = q.state || q.now, pV = q.path || q.why, tV = q.tension || q.problem;
      var has = function (v) { return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim()); };
      var col = function (label, v, cls) {
        return '<div class="ctxc' + (cls ? ' ' + cls : '') + '"><span class="eyebrow">' + label +
          '</span>' + (Array.isArray(v) ? bullets(v) : '<p>' + md(v) + '</p>') + '</div>';
      };
      var cols = [];
      if (has(sV)) cols.push(col('Where it stands', sV));
      if (has(pV)) cols.push(col('How it got here', pV));
      if (has(tV)) cols.push(col('What forces a choice', tV, 'tension'));
      if (cols.length) h += '<div class="ctx">' + cols.join('') + '</div>';

    if (q.evidence && q.evidence.length) {
      h += '<details class="ev"><summary>' + icon('chevron_right', 'caret') + 'Evidence' +
        '<span class="cnt">' + q.evidence.length + ' ' + (q.evidence.length === 1 ? 'exhibit' : 'exhibits') + '</span></summary>' +
        '<div class="evbody">' + q.evidence.map(evBlock).join('') + '</div></details>';
      }

      /* Screen iterations bound to this decision. Each one is a real alternative for the
         surface the card decides, not decoration -- clicking opens it full size in a new tab. */
      if (window.MOCKUPS) {
        var mine = window.MOCKUPS.filter(function (m) { return m.card === q.id; });
        if (mine.length) {
          h += '<div class="ev mocks"><div class="mockhead">' +
            mine.length + ' screen ' + (mine.length === 1 ? 'iteration' : 'iterations') +
            ' for this decision</div><div class="mockrow">' +
            mine.map(function (m) {
              return '<a class="mock" href="mockups.html?m=' + esc(m.id) + '" target="_blank" rel="noopener">' +
                '<span class="mt">' + esc(m.screen) + '</span>' +
                '<span class="mn">' + esc(m.name) + '</span></a>';
            }).join('') + '</div></div>';
        }
      }

      if (q.dupes && q.dupes.dropped && q.dupes.dropped.length) {
        /* The cross-area pass matched on the QUESTION and never compared recommendations, so a
           survivor can carry the minority view: the free-engine probe was asked five times and
           the four merged cards recommended b, b, b and c against this card's a. Show it. */
        /* Dropped ids are not shown: the reader cannot open those cards. The areas they came
           from are. The agreement line is printed only when the entry carries a checked
           `agree`, because a fixed "did not all agree" was false on the entries that did. */
        var ar = q.dupes.areas || [];
        var where = ar.length ? (ar.length === 1 ? ar[0] : ar.slice(0, -1).join(', ') + ' and ' + ar[ar.length - 1]) : '';
        var verdict = q.dupes.agree === true ? ' Every version recommended the same choice as this card.' :
          q.dupes.agree === false ? ' They did not all recommend the same choice.' : '';
        h += '<details class="ev dupes"><summary>' + icon('chevron_right', 'caret') +
          'Also asked in other areas<span class="cnt">' + q.dupes.dropped.length +
          ' merged</span></summary><div class="evbody">' +
          ((where || verdict) ? '<p>' + (where ? 'Also asked in ' + esc(where) + '.' : '') + verdict + '</p>' : '') +
          (q.dupes.why ? '<p>' + md(q.dupes.why) + '</p>' : '') + '</div></details>';
      }

    h += '<div class="optshead"><span class="eyebrow">The options</span>' +
      '<span class="hint">press <kbd>a</kbd>\u2013<kbd>' +
      String.fromCharCode(96 + Math.max(1, (q.options || []).length)) + '</kbd> to choose</span></div>';
    h += '<div class="opts" role="radiogroup" aria-label="Options">';
    (q.options || []).forEach(function (o) {
      var meta = [];
      if (o.system) meta.push(['System', o.system]);
      if (o.screens) meta.push(['Screens', o.screens]);
      if (o.money) meta.push(['Money', o.money]);
      h += '<button class="opt' + (o.k === q.rec ? ' rec' : '') + (pick === o.k ? ' on' : '') +
        '" data-pick="' + esc(o.k) + '" role="radio" aria-checked="' + (pick === o.k) + '">' +
        '<span class="k">' + esc(o.k) + '</span><span class="ob">' +
        '<span class="ol">' + md(o.label) + (o.k === q.rec ? '<span class="rectag">recommended</span>' : '') + '</span>' +
        (o.what ? '<span class="ow">' + md(o.what) + '</span>' : '') +
        (o.impact && !o.gains && !o.costs ? '<span class="oi">' + md(o.impact) + '</span>' : '') +
        ((o.gains || o.costs) ? '<span class="gc">' +
          '<span class="gcc gain"><span class="gch">What it buys</span>' + bullets(o.gains, 'bl tight') + '</span>' +
          '<span class="gcc cost"><span class="gch">What it costs</span>' + bullets(o.costs, 'bl tight') + '</span></span>' : '') +
        (meta.length ? '<span class="ometa">' + meta.map(function (m) {
          return '<span class="om"><b>' + m[0] + '</b> ' + md(m[1]) + '</span>';
        }).join('') + '</span>' : '') +
        '</span></button>';
    });
    h += '</div>';

    if (q.recCase) {
      h += '<div class="reccase"><div class="rh">' + icon('lightbulb') +
        'Why ' + esc(String(q.rec).toUpperCase()) + '</div>' +
        (Array.isArray(q.recCase) ? bullets(q.recCase) : md(q.recCase));
      if (q.flip) h += '<div class="flip"><b>What would change this answer.</b> ' + md(q.flip) + '</div>';
      h += '</div>';
    }

    if (q.linked && q.linked.length) {
      var live = q.linked.filter(function (id) { return Q.some(function (x) { return x.id === id; }); });
      if (live.length) {
        h += '<div class="linked"><span class="eyebrow">Decide alongside</span><span class="lchips">' +
          live.map(function (id) {
            var t = Q.filter(function (x) { return x.id === id; })[0];
            return '<button class="lchip" data-q="' + esc(id) + '"><b>' + esc(id) + '</b> ' + esc(t.q) + '</button>';
          }).join('') + '</span></div>';
      }
    }

    h += '<textarea class="note" id="note" placeholder="Your note on this decision. It is saved in this browser.">' +
      esc(state.notes[q.id] || '') + '</textarea>';
    h += '</div>';

    h += '<div class="foot">';
    h += prev ? '<button class="pg" data-q="' + esc(prev.id) + '"><span class="pk">' + icon('arrow_back') +
      'Previous</span><span class="pt">' + esc(prev.q) + '</span></button>' : '<span></span>';
    if (next) {
      h += '<button class="go' + (pick ? ' primary' : '') + '" data-q="' + esc(next.id) + '">' +
        '<span class="gt">' + (pick ? 'Next decision' : 'Skip for now') + '</span>' +
        '<span class="gk">or press <kbd>\u21b5</kbd></span>' + icon('arrow_forward') + '</button>';
    } else {
      h += '<button class="go" data-ov="1"><span class="gt">Back to the overview</span></button>';
    }
    h += '</div>';
    $('#main').innerHTML = h;
    $('#main').scrollTop = 0;

    /* right rail: where this question came from */
    var rail = '<div class="rsec"><div class="rh">This decision</div>' +
      '<div class="rrow"><span>Position</span><b>' + (idx + 1) + ' of ' + Q.length + '</b></div>' +
      '<div class="rrow"><span>Weight</span><b>' + esc(q.weight || 'none') + '</b></div>' +
      '<div class="rrow"><span>Area</span><b>' + esc(q.cat) + '</b></div>' +
      (q.sub ? '<div class="rrow"><span>Group</span><b>' + esc(q.sub) + '</b></div>' : '') +
      '<div class="rrow"><span>Status</span><b style="color:var(--' + (pick ? 'good' : 'ink-3') + ')">' +
      (pick ? 'answered ' + esc(pick).toUpperCase() : 'open') + '</b></div></div>';
    if (WHEN[q.when]) {
      rail += '<div class="rsec"><div class="rh">When to answer</div>' +
        '<div class="rrow"><span>Stage</span><b>' + esc(WHEN[q.when]) + '</b></div>' +
        (q.whenWhy ? '<div class="rnote">' + md(q.whenWhy) + '</div>' : '') + '</div>';
    }
    if (q.sources && q.sources.length) {
      rail += '<div class="rsec"><div class="rh">Where this came from</div>' +
        q.sources.map(function (s) { return '<span class="src">' + esc(s) + '</span>'; }).join('') + '</div>';
    }
    var same = Q.filter(function (o) { return o.cat === q.cat && o.id !== q.id; }).slice(0, 8);
    if (same.length) {
      rail += '<div class="rsec"><div class="rh">Also in ' + esc(q.cat) + '</div>' +
        same.map(function (o) {
          return '<button class="rlink' + (state.picks[o.id] ? ' done' : '') + '" data-q="' + esc(o.id) + '">' +
            '<span class="rm">' + esc(o.id) + (state.picks[o.id] ? ' · answered' : '') + '</span>' + esc(o.q) + '</button>';
        }).join('') + '</div>';
    }
    $('#aside').innerHTML = rail;
    $('#abarPos').innerHTML = '<b>' + esc(q.id) + '</b>' + (idx + 1) + ' of ' + Q.length;
    $('#abarPrev').disabled = !prev; $('#abarNext').disabled = !next;
  }

  /* ── overview ─────────────────────────────────────────────────────────── */
  function renderOverview() {
    var groups = cats(), a = answered(Q), c = crit(Q);
    var ev = Q.reduce(function (n, q) { return n + (q.evidence || []).length; }, 0);
    var tagged = Q.filter(function (q) { return WHEN[q.when]; });
    var openIn = function (k) { return Q.filter(function (q) { return q.when === k && !state.picks[q.id]; }); };
    var h = '<div class="hero"><span class="eyebrow">Studio Zephyrus · frontmatter</span>' +
      '<h1>Decisions pending on frontmatter</h1>' +
      '<p>' + Q.length + ' decisions and ' + CHORES.length + ' tasks, drawn from three ' +
      'weeks of research, including a round of checks that went against the plan\'s own headline and a ' +
      'market sweep on 9 September that changed several answers. ' +
      Q.filter(function (q) { return q.when === 'mvp'; }).length + ' of them block the MVP; the rest ' +
      'are staged for later. Each one shows the thing being decided, where it stands, what forces a ' +
      'choice, the evidence, and what every option buys and costs. Answers stay in this browser. ' +
      '<a class="gallerylink" href="mockups.html" target="_blank" rel="noopener">See the screen iterations</a></p></div>';
    h += '<div class="kpis">' +
      '<div class="kpi acc"><div class="kn">Answered</div><div class="kv">' + a + '</div>' +
        '<div class="kn">of ' + Q.length + ' in the set</div></div>' +
      (tagged.length ? '<div class="kpi crit"><div class="kn">Open for the spec</div><div class="kv">' +
        openIn('spec').length + '</div><div class="kn">answer these first</div></div>' : '') +
      '<div class="kpi' + (tagged.length ? '' : ' crit') + '"><div class="kn">Critical open</div><div class="kv">' + c + '</div>' +
        '<div class="kn">' + (tagged.length ? 'across every stage' : 'decide these first') + '</div></div>' +
      (tagged.length ? '' : '<div class="kpi"><div class="kn">Areas</div><div class="kv">' + groups.length + '</div>' +
        '<div class="kn">grouped for the meeting</div></div>') +
      '<div class="kpi"><div class="kn">Evidence</div><div class="kv">' + ev + '</div>' +
        '<div class="kn">exhibits behind them</div></div></div>';
    if (tagged.length) {
      /* Not every decision blocks the spec. Each card is tagged with the point at which its answer
         is needed, so the spec can start once the first group is done. */
      h += '<h2 class="sech">What needs answering, and when</h2><p class="secn">Each decision is tagged by ' +
        'the point at which its answer is needed. The spec can be written once the first group is answered.</p>';
      h += '<div class="grid stages">' + WHEN_ORDER.map(function (k) {
        var qs = Q.filter(function (q) { return q.when === k; });
        if (!qs.length) return '';
        var open = openIn(k), done = qs.length - open.length, go = open[0] || qs[0];
        return '<button class="cat stage when-' + k + '" data-q="' + esc(go.id) + '">' +
          '<div class="ct">' + esc(WHEN[k]) + '</div>' +
          '<div class="cs"><span>' + done + ' of ' + qs.length + ' answered</span></div>' +
          '<div class="cbar"><i style="width:' + (done / qs.length) * 100 + '%"></i></div></button>';
      }).join('') + '</div>';
    }
    if (CHORES.length) {
      h += '<h2 class="sech">' + CHORES.length + ' chores, not decisions</h2>' +
        '<p class="secn">Each of these has one sensible answer and somebody just has to do it. ' +
        'They are here so they are not forgotten, and out of the count so they do not look ' +
        'like something to sit and argue about.</p>';
      h += '<ul class="chores">' + CHORES.map(function (q) {
        var rec = q.options[('abcd').indexOf(q.rec)];
        return '<li><span class="chid">' + esc(q.id) + '</span>' +
          '<span class="chq">' + esc(q.q) + '</span>' +
          (rec ? '<span class="chr">' + esc(rec.label) + '</span>' : '') + '</li>';
      }).join('') + '</ul>';
    }
    h += '<h2 class="sech">By area</h2><p class="secn">Ordered the way the plan reads, not the way they were found.</p>';
    h += '<div class="grid">' + groups.map(function (g) {
      var ga = answered(g.qs), gc = crit(g.qs), pct = g.qs.length ? (ga / g.qs.length) * 100 : 0;
      return '<button class="cat" data-cat="' + esc(g.cat) + '">' +
        '<div class="ct">' + esc(g.cat) + '</div>' +
        '<div class="cs"><span>' + ga + ' of ' + g.qs.length + '</span>' +
        (gc ? '<span class="cc">' + gc + ' critical</span>' : '') + '</div>' +
        '<div class="cbar"><i style="width:' + pct + '%"></i></div></button>';
    }).join('') + '</div>';
    /* Start here: the earliest stage that still has open cards, critical first. Untagged sets keep
       the old list of critical open cards. */
    var stage = null, openCrit;
    if (tagged.length) {
      for (var si = 0; si < WHEN_ORDER.length && !stage; si++) if (openIn(WHEN_ORDER[si]).length) stage = WHEN_ORDER[si];
      openCrit = stage ? openIn(stage).slice().sort(function (x, y) {
        return (RANK[x.weight] || 3) - (RANK[y.weight] || 3);
      }).slice(0, 12) : [];
    } else {
      openCrit = Q.filter(function (q) { return q.weight === 'critical' && !state.picks[q.id]; }).slice(0, 10);
    }
    if (openCrit.length) {
      h += stage
        ? '<h2 class="sech">Start here: ' + esc(WHEN[stage].toLowerCase()) + '</h2><p class="secn">Unanswered, ' +
          'critical first. ' + (stage === 'spec' ? 'The spec cannot be written until these are answered.' :
          'Everything the spec needs is answered; this is the next stage.') + '</p><div class="qlist">'
        : '<h2 class="sech">Start here</h2><p class="secn">Critical and unanswered. A wrong answer to any of ' +
          'these costs the product or the company.</p><div class="qlist">';
      h += openCrit.map(function (q) {
        return '<button class="ql" data-q="' + esc(q.id) + '">' +
          '<span class="qi">' + esc(q.id) + '</span>' +
          '<span class="qq">' + esc(q.q) + '</span>' +
          '<span class="qc">' + esc(q.cat) + '</span></button>';
      }).join('') + '</div>';
    }
    $('#main').innerHTML = h; $('#main').scrollTop = 0;
    $('#aside').innerHTML = '<div class="rsec"><div class="rh">Your answers</div>' +
      '<button class="rlink" id="expMd"><span class="rm">Markdown</span>Decisions taken, and what is still open</button>' +
      '<button class="rlink" id="expJson"><span class="rm">JSON</span>Raw answers and notes, the file that restores them</button>' +
      '<button class="rlink" id="impJson"><span class="rm">Restore</span>Load a JSON export back in</button>' +
      '<div class="rnote">Answers live in this browser only. Export after every sitting. Clearing site data loses them.</div></div>' +
      '<div class="rsec"><div class="rh">Keyboard</div>' +
      '<div class="rrow"><span>Next / previous</span><b class="mono">j k</b></div>' +
      '<div class="rrow"><span>Choose an option</span><b class="mono">a–d</b></div>' +
      '<div class="rrow"><span>Search</span><b class="mono">/</b></div></div>';
    $('#abarPos').innerHTML = '<b>' + a + ' / ' + Q.length + '</b>answered';
  }

  /* ── one area: every question in it, with its state ──────────────────────
     Graphite groups its review inbox by state with a count per group, and that
     reads better at scale than dropping someone into question one of thirty-four. */
  function renderArea(cat) {
    var qs = Q.filter(function (x) { return x.cat === cat; });
    var a = answered(qs), c = crit(qs);
    var open = qs.filter(function (q) { return !state.picks[q.id]; });
    var done = qs.filter(function (q) { return state.picks[q.id]; });
    var row = function (q) {
      var pickOpt = (q.options || []).filter(function (o) { return o.k === state.picks[q.id]; })[0];
      return '<button class="ar' + (state.picks[q.id] ? ' done' : '') +
        (q.weight === 'critical' ? ' crit' : q.weight === 'high' ? ' high' : '') +
        '" data-q="' + esc(q.id) + '">' +
        '<span class="ai">' + esc(q.id) + '</span>' +
        '<span class="aq">' + esc(q.q) +
        (pickOpt ? '<span class="aa">' + icon('check', 's') + esc(pickOpt.label) + '</span>' : '') + '</span>' +
        '<span class="aw">' + (state.picks[q.id] ? '' : esc(q.weight || '')) + '</span></button>';
    };
    var h = '<div class="hero"><span class="eyebrow">Area ' + (cats().map(function (g) { return g.cat; }).indexOf(cat) + 1) +
      ' of ' + cats().length + '</span><h1>' + esc(cat) + '</h1>' +
      '<p>' + qs.length + ' decisions · ' + a + ' answered · ' +
      (c ? c + ' critical still open' : 'no critical left open') + '.</p></div>';
    if (open.length) {
      h += '<button class="go primary wide" data-q="' + esc(open[0].id) + '">' +
        '<span class="gt">Start with ' + esc(open[0].id) + '</span>' +
        '<span class="gk">' + esc(open.length) + ' open</span>' + icon('arrow_forward') + '</button>';
      h += '<h2 class="sech">Open</h2><div class="arlist">' + open.map(row).join('') + '</div>';
    }
    if (done.length) {
      h += '<h2 class="sech">Answered</h2><div class="arlist">' + done.map(row).join('') + '</div>';
    }
    $('#main').innerHTML = h; $('#main').scrollTop = 0;
    $('#aside').innerHTML = '<div class="rsec"><div class="rh">This area</div>' +
      '<div class="rrow"><span>Decisions</span><b>' + qs.length + '</b></div>' +
      '<div class="rrow"><span>Answered</span><b>' + a + '</b></div>' +
      '<div class="rrow"><span>Critical open</span><b style="color:var(--crit)">' + c + '</b></div></div>';
    $('#abarPos').innerHTML = '<b>' + a + ' / ' + qs.length + '</b>' + esc(cat);
  }

  /* ── markdown import — the sidecar ───────────────────────────────────── */
  function renderImport() {
    $('#main').innerHTML =
      '<div class="hero"><span class="eyebrow">Import</span><h1>Import a decision file</h1>' +
      '<p>Paste or drop a markdown file and it becomes decision cards. ' +
      'The file stays the source, and the page only shows what is in it. ' +
      'Nothing is uploaded. The file is read in this browser.</p>' +
      '</div><div class="drop" id="drop">' + icon('upload') +
      '<div style="margin-top:8px">Drop a <b>.md</b> file here, or paste below</div></div>' +
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
      '<div style="margin-top:14px;display:flex;gap:9px;flex-wrap:wrap">' +
      '<button class="btn primary" id="mdgo">' + icon('add') + 'Render as decisions</button>' +
      '<button class="btn" id="mdsample">Load the example</button></div>' +
      '<div id="mdout" style="margin-top:18px"></div>';
    $('#aside').innerHTML = '<div class="rsec"><div class="rh">The format</div>' +
      '<div class="rrow"><span>The question</span><b class="mono">##</b></div>' +
      '<div class="rrow"><span>cat, sub, weight, id</span><b class="mono">- key: value</b></div>' +
      '<div class="rrow"><span>The lede</span><b class="mono">&gt;</b></div>' +
      '<div class="rrow"><span>Context</span><b class="mono">now: why: problem:</b></div>' +
      '<div class="rrow"><span>An option</span><b class="mono">- [ ] a. ...</b></div>' +
      '<div class="rrow"><span>The recommendation</span><b class="mono">- [x]</b></div></div>' +
      '<div class="rsec"><div class="rh">Why this exists</div>' +
      '<p style="font-size:12.5px;color:var(--ink-2);line-height:1.55;margin:0">' +
      'The file stays the source, and this page only shows what is in it. Parsing happens in your browser ' +
      'and nothing is uploaded.</p></div>';
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
    out.innerHTML = '<div class="cat" style="border-color:var(--accent)"><div class="ct">' + parsed.length +
      ' question' + (parsed.length === 1 ? '' : 's') + ' parsed</div><div class="cs">' +
      parsed.map(function (p) { return esc(p.q); }).join(' · ') + '</div></div>' +
      '<div style="margin-top:12px"><button class="btn primary" id="mdadd">Add to this session</button></div>';
    $('#mdadd').onclick = function () {
      parsed.forEach(function (p) { if (!Q.some(function (x) { return x.id === p.id; })) Q.push(p); });
      // The nav only expands the group whose cat matches view.cat, so naming this
      // 'Imported' left the imported question's own category collapsed and the row
      // unreachable. Follow the question.
      view = { mode: 'q', id: parsed[0].id, cat: parsed[0].cat, filter: '' };
      location.hash = '#' + parsed[0].id;
      navShape = null; renderNav(); renderQ(parsed[0]);
    };
  }

  /* ── export ───────────────────────────────────────────────────────────── */
  function exportMd() {
    var lines = ['# frontmatter decisions', '', 'Answered ' + answered(Q) + ' of ' + Q.length + '.', ''];
    cats().forEach(function (g) {
      var done = g.qs.filter(function (q) { return state.picks[q.id]; });
      if (!done.length) return;
      lines.push('## ' + g.cat, '');
      done.forEach(function (q) {
        var o = (q.options || []).filter(function (x) { return x.k === state.picks[q.id]; })[0];
        lines.push('### ' + q.id + ': ' + q.q);
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

  /* Restore answers from a JSON export.
     Merges rather than replaces: a restore should never silently discard an answer
     given in this browser since the export was taken. Where both sides hold a value
     for the same decision, the file wins and the count of overwrites is reported, so
     the reader can tell a clean restore from a collision. */
  function restoreAnswers() {
    var inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json,.json';
    inp.onchange = function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var data;
        try { data = JSON.parse(String(r.result)); }
        catch (e) { alert('That file is not valid JSON.'); return; }
        if (!data || typeof data !== 'object' || (!data.picks && !data.notes)) {
          alert('That JSON has no "picks" or "notes", so it is not a decisions export.');
          return;
        }
        var live = {}, i;
        for (i = 0; i < Q.length; i++) live[Q[i].id] = 1;

        var added = 0, changed = 0, unknown = 0, notes = 0;
        var picks = data.picks || {};
        Object.keys(picks).forEach(function (id) {
          if (!live[id]) { unknown++; return; }
          if (state.picks[id] === picks[id]) return;
          if (state.picks[id]) changed++; else added++;
          state.picks[id] = picks[id];
        });
        var nn = data.notes || {};
        Object.keys(nn).forEach(function (id) {
          if (!live[id] || !nn[id]) return;
          if (state.notes[id] !== nn[id]) { state.notes[id] = nn[id]; notes++; }
        });

        save(); navShape = null; renderNav(); go({ mode: 'overview' });
        alert('Restored ' + added + ' answer' + (added === 1 ? '' : 's') +
          (changed ? ', overwrote ' + changed : '') +
          (notes ? ', ' + notes + ' note' + (notes === 1 ? '' : 's') : '') +
          (unknown ? '. ' + unknown + ' id' + (unknown === 1 ? '' : 's') +
            ' in the file no longer exist here and were skipped.' : '.'));
      };
      r.readAsText(f);
    };
    inp.click();
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
    } else if (view.mode === 'area') {
      renderArea(view.cat); location.hash = '#area-' + encodeURIComponent(view.cat);
    } else if (view.mode === 'import') { renderImport(); location.hash = '#import'; }
    else { renderOverview(); location.hash = '#overview'; }
    paintNav(); progress();
  }
  function progress() {
    var a = answered(Q), c = crit(Q), n = Q.length || 1;
    $('#prog').style.width = (a / n) * 100 + '%';
    $('#progCrit').style.width = (c / n) * 100 + '%';
    var here = '';
    if (view.mode === 'q' && view.cat) {
      var g = Q.filter(function (x) { return x.cat === view.cat; });
      here = '<span class="pcat">' + esc(view.cat) + ' ' + answered(g) + '/' + g.length + '</span>';
    }
    $('#progtxt').innerHTML = here + '<b>' + a + '</b> / ' + Q.length + ' answered' +
      (c ? ' · <b style="color:var(--crit)">' + c + '</b> critical' : '');
  }

  /* ── events ───────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-q],[data-cat],[data-ov],[data-import],[data-pick],#expMd,#expJson,#impJson,#mdgo,#mdsample,#menuBtn,#themeBtn,#abarPrev,#abarNext');
    if (!t) return;
    if (t.id === 'menuBtn') { document.body.classList.toggle('navopen'); return; }
    if (t.id === 'themeBtn') { theme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); return; }
    if (t.id === 'expMd') { exportMd(); return; }
    if (t.id === 'expJson') { download('frontmatter-decisions.json', JSON.stringify(state, null, 2), 'application/json'); return; }
    if (t.id === 'impJson') { restoreAnswers(); return; }
    if (t.id === 'mdgo') { doImport(); return; }
    if (t.id === 'mdsample') { $('#mdin').value = $('#mdin').placeholder; doImport(); return; }
    if (t.id === 'abarPrev' || t.id === 'abarNext') { step(t.id === 'abarNext' ? 1 : -1); return; }
    if (t.hasAttribute('data-pick')) {
      var q = Q.filter(function (x) { return x.id === view.id; })[0];
      if (!q) return;
      state.picks[q.id] = t.getAttribute('data-pick'); save(); renderQ(q); paintNav(); progress(); return;
    }
    if (t.hasAttribute('data-q')) { go({ mode: 'q', id: t.getAttribute('data-q') }); return; }
    if (t.hasAttribute('data-cat')) {
      go({ mode: 'area', cat: t.getAttribute('data-cat'), id: null });
      return;
    }
    if (t.hasAttribute('data-ov')) { go({ mode: 'overview', id: null }); return; }
    if (t.hasAttribute('data-import')) { go({ mode: 'import', id: null }); return; }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'navsearch') {
      /* Debounced. Typing "vakalatnama" used to run eleven full rebuilds of the
         whole list; it now runs one, and the input is no longer destroyed so the
         caret restore that used to be needed here is gone. */
      view.filter = e.target.value;
      clearTimeout(searchT);
      searchT = setTimeout(function () { navShape = null; paintNav(); }, 110);
    }
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
    if (e.key === 'Enter' && view.mode === 'q') { e.preventDefault(); step(1); return; }
    if (e.key === 'j') { e.preventDefault(); step(1); return; }
    if (e.key === 'k') { e.preventDefault(); step(-1); return; }
    if (view.mode === 'q' && /^[a-d]$/.test(e.key)) {
      var q = Q.filter(function (x) { return x.id === view.id; })[0];
      if (q && (q.options || []).some(function (o) { return o.k === e.key; })) {
        state.picks[q.id] = e.key; save(); renderQ(q); paintNav(); progress();
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
  function fromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (!h || h === 'overview') return { mode: 'overview', id: null };
    if (h === 'import') return { mode: 'import', id: null };
    if (h.indexOf('area-') === 0) {
      var cat = decodeURIComponent(h.slice(5));
      if (Q.some(function (x) { return x.cat === cat; })) return { mode: 'area', cat: cat, id: null };
      return { mode: 'overview', id: null };
    }
    if (Q.some(function (x) { return x.id === h; })) return { mode: 'q', id: h };
    return { mode: 'overview', id: null };
  }
  go(fromHash());
  window.addEventListener('hashchange', function () {
    var v = fromHash();
    if (v.mode !== view.mode || v.id !== view.id || (v.mode === 'area' && v.cat !== view.cat)) go(v);
  });
})();
