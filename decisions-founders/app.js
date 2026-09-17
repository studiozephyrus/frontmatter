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
    try {
      var st = JSON.parse(localStorage.getItem(KEY)) || {};
      st.picks = st.picks || {}; st.notes = st.notes || {}; st.final = st.final || {};
      /* How much of each card is showing: 'low', 'med' or 'high'. Absent means low, so
         nothing in localStorage from before this existed has to migrate. */
      st.detail = st.detail || {};
      st.detailDefault = st.detailDefault || 'low';
      st.showTaken = !!st.showTaken;
      st.showAll = !!st.showAll;
      return st;
    }
    catch (e) { return { picks: {}, notes: {}, final: {}, detail: {} }; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} computeStatus(); }

  /* ── the compact set ──────────────────────────────────────────────────────
     Three decisions only the founders can take, five facts only they know, and every
     other card TAKEN on its own recommendation until somebody overrules it. A take is
     written under assumptions: `deps` lists, per card, the answers it assumed. When one
     of those answers changes, the card re-opens instead of staying quietly answered on a
     premise that has moved. Status is derived from the picks and the root answers on
     every change, never stored. */
  var FINAL = window.FINAL || {};
  var ROOTS = FINAL.decisions || [];
  var ROOT_BY = {}; ROOTS.forEach(function (d) { ROOT_BY[d.id] = d; });
  var FACTS = (FINAL.facts && FINAL.facts.cards) || [];
  var DEPS = FINAL.deps || {};
  var QBY = {}; Q.forEach(function (q) { QBY[q.id] = q; });
  var isFact = function (id) { return FACTS.indexOf(id) > -1; };
  /* The meeting set: the critical product and business calls, numbered 1 to N in the
     order the founders read them. The number rides on every surface the card appears on,
     so "question 12" means the same thing on the overview, in the nav and on the card. */
  var MEET = FINAL.meeting || {}, MLIST = MEET.cards || [];
  var MEETN = {}; MLIST.forEach(function (id, i) { MEETN[id] = i + 1; });
  var mnum = function (id, cls) { var n = MEETN[id]; return n ? '<span class="mnum' + (cls ? ' ' + cls : '') + '" title="Question ' + n + ' of ' + MLIST.length + '">' + n + '</span>' : ''; };
  /* Focus. By default the site shows the meeting set and nothing else: the nav, the pager,
     the rail and the overview all run over the 23. `showAll` opens the other 180 cards up
     again; a search always looks through everything, and a hidden card still opens from
     its own link. In focus, "answered" means answered by the founders: a taken card that
     nobody has confirmed still counts as waiting. */
  var focus = function () { return !state.showAll && MLIST.length > 0; };
  var needsYou = function (id) { return ROOT_BY[id] ? !rootAnswer(id) : !state.picks[id]; };
  var meetAnswered = function () { return MLIST.filter(function (id) { return !needsYou(id); }).length; };
  function VIS() { return focus() ? MLIST.filter(function (id) { return QBY[id]; }).map(function (id) { return QBY[id]; }) : Q; }
  var STATUS = {};
  /* A root is answered with an option key, or with the founder's own line. */
  function rootAnswer(id) { var a = state.final[id]; if (!a) return null; return a.k || (a.own ? 'own' : null); }
  /* What a card or root currently answers, or null while open. A taken card answers its
     recommendation; a re-opened one answers nothing, which is what re-opens its dependents. */
  function effective(id) {
    if (ROOT_BY[id]) return rootAnswer(id);
    var q = QBY[id]; if (!q) return null;
    if (state.picks[id]) return state.picks[id];
    if (isFact(id) || STATUS[id] === 'reopened') return null;
    return q.rec || null;
  }
  function depOk(dep) {
    var e = effective(dep[0]);
    /* An unanswered root or fact leaves the take standing, provisionally. */
    if (e == null) return !!ROOT_BY[dep[0]] || (isFact(dep[0]) && !state.picks[dep[0]]);
    return e === dep[1];
  }
  function computeStatus() {
    STATUS = {};
    Q.forEach(function (q) {
      var p = state.picks[q.id];
      if (isFact(q.id)) STATUS[q.id] = p ? 'answered' : 'fact';
      else if (p) STATUS[q.id] = (q.rec && p !== q.rec) ? 'overruled' : 'answered';
      else STATUS[q.id] = 'taken';
    });
    /* Re-opening propagates: a card taken under a re-opened card re-opens too. The only
       move is taken to reopened, so this converges. */
    for (var pass = 0, changed = true; changed && pass < 16; pass++) {
      changed = false;
      Q.forEach(function (q) {
        if (STATUS[q.id] !== 'taken') return;
        var ds = DEPS[q.id] || [];
        for (var i = 0; i < ds.length; i++) if (!depOk(ds[i])) { STATUS[q.id] = 'reopened'; changed = true; return; }
      });
    }
  }
  var isOpen = function (id) { return STATUS[id] === 'fact' || STATUS[id] === 'reopened'; };
  var isDone = function (id) { return !!STATUS[id] && !isOpen(id); };
  function brokenDeps(id) { return (DEPS[id] || []).filter(function (d) { return !depOk(d); }); }
  function labelOf(id, k) {
    var src = ROOT_BY[id] || QBY[id]; if (!src) return k;
    var o = (src.options || []).filter(function (x) { return x.k === k; })[0];
    return o ? o.label : (k === 'own' ? 'your own line' : k);
  }
  var rootsOpen = function () { return ROOTS.filter(function (d) { return !rootAnswer(d.id); }); };
  var openOf = function (list) { return list.filter(function (q) { return isOpen(q.id); }); };
  var countOf = function (list, s) { return list.filter(function (q) { return STATUS[q.id] === s; }).length; };
  /* what is genuinely the founders': open roots, open facts, and anything re-opened */
  var yoursOpen = function () { return rootsOpen().length + openOf(Q).length; };
  computeStatus();

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
  var answered = function (list) { return list.filter(function (q) { return isDone(q.id); }).length; };
  var crit = function (list) { return list.filter(function (q) { return q.weight === 'critical' && isOpen(q.id); }).length; };
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
      '<div id="navlist"></div>' +
      /* The export, restore and keyboard-hint panel lives in the right rail, which is
         display:none below 1180px — a phone or tablet could save answers but never get
         them back out. navactions is that same panel, a second copy, shown only where
         the rail is hidden (see .navactions in app.css), reached through the menu that
         already exists. */
      '<div class="navactions"><div class="rsec"><div class="rh">Your answers are saved</div>' +
      '<p class="rsub">In this browser only. Export after every sitting.</p>' +
      '<button class="rlink" data-action="expjson"><span class="rm">JSON</span>Download every answer and note</button>' +
      '<button class="rlink" data-action="expmd"><span class="rm">Markdown</span>What is decided, and what is open</button>' +
      '<button class="rlink" data-action="impjson"><span class="rm">Restore</span>Load a JSON export back in</button></div></div>';
  }

  function syncNav() {
    var list = $('#navlist');
    if (!list) return false;
    var i, el, els = list.querySelectorAll('.navq');
    for (i = 0; i < els.length; i++) {
      el = els[i];
      var id = el.getAttribute('data-q') || el.getAttribute('data-root'), st = STATUS[id], isR = !!ROOT_BY[id];
      var done = isR ? !!rootAnswer(id) : (focus() ? !!state.picks[id] : isDone(id));
      el.classList.toggle('on', id === view.id);
      el.classList.toggle('done', done);
      el.classList.toggle('open', !done);
      el.classList.toggle('taken', !isR && !focus() && st === 'taken');
      el.classList.toggle('reopen', st === 'reopened');
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
    if (ov) ov.textContent = focus() ? meetAnswered() + '/' + MLIST.length : answered(Q) + '/' + Q.length;
    return true;
  }

  /* Cheap when nothing structural moved, full rebuild when it did. */
  function paintNav() {
    var shape = (view.filter || '') + '\u0000' + (view.mode === 'q' || view.mode === 'area' ? (view.cat || '') : '\u0000' + view.mode) +
      (state.showTaken ? '\u0001' : '') + (state.showAll ? '\u0002' : '');
    if (shape === navShape && syncNav()) return;
    navShape = shape;
    renderNav();
  }

  function renderNav() {
    var f = view.filter, groups = cats(), h = '', fo = focus();
    navShell();
    h += '<div class="nsec">';
    h += '<button class="navcat' + (view.mode === 'overview' ? ' on' : '') + '" data-ov="1">' +
      '<span class="nl">Overview</span><span class="nmeta"><span class="np">' +
      (fo ? meetAnswered() + '/' + MLIST.length : answered(Q) + '/' + Q.length) + '</span></span></button>';
    h += '<button class="navcat' + (view.mode === 'import' ? ' on' : '') + '" data-import="1">' +
      '<span class="nl">Import markdown</span><span class="nmeta"><span class="np">local</span></span></button>';
    if (MLIST.length) {
      h += '<button class="navtoggle" data-action="toggleall">' + (fo
        ? 'Showing the ' + MLIST.length + ' for the meeting · <b>show all ' + Q.length + '</b>'
        : 'Showing all ' + Q.length + ' · <b>show only the ' + MLIST.length + '</b>') + '</button>';
    }
    h += '</div>';
    if (fo && !f) {
      /* The meeting set, flat and in its numbered order. A search leaves focus for as
         long as the field has text, so anything hidden is one keystroke away. */
      h += '<div class="nsec meetnav">' + MLIST.map(function (id) { var src = ROOT_BY[id] || QBY[id]; return src ? navRow(src) : ''; }).join('') + '</div>';
      $('#navlist').innerHTML = h;
      return;
    }
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
      if (open) {
        /* Taken cards are folded out of the list by default: they are answered, and
           listing 198 of them beside the eight that are open is the noise the compact
           set exists to remove. A search or the toggle shows them. */
        var show = qs, hid = 0;
        if (!f && !state.showTaken) { show = qs.filter(function (q) { return STATUS[q.id] !== 'taken' || MEETN[q.id]; }); hid = qs.length - show.length; }
        show.forEach(function (q) { h += navRow(q); });
        if (hid) h += '<button class="navtk" data-action="toggletaken">' + hid + ' taken on the evidence · show</button>';
        else if (!f && state.showTaken && qs.some(function (q) { return STATUS[q.id] === 'taken'; })) h += '<button class="navtk" data-action="toggletaken">hide the taken cards</button>';
      }
    });
    $('#navlist').innerHTML = h;
  }
  function navRow(q) {
    var isR = !!ROOT_BY[q.id], st = STATUS[q.id];
    var done = isR ? !!rootAnswer(q.id) : (focus() ? !!state.picks[q.id] : isDone(q.id));
    return '<button class="navq' + (view.id === q.id ? ' on' : '') + (done ? ' done' : ' open') +
      (!isR && !focus() && st === 'taken' ? ' taken' : st === 'reopened' ? ' reopen' : '') +
      (isR || q.weight === 'critical' ? ' crit' : q.weight === 'high' ? ' high' : '') +
      '" data-' + (isR ? 'root' : 'q') + '="' + esc(q.id) + '"><span class="dot"></span>' +
      '<span class="qt">' + (MEETN[q.id] ? '<i class="nn">' + MEETN[q.id] + '</i>' : '') + esc(q.q) + '</span></button>';
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
      /* The axis has to include the threshold, not just the data: D1's exhibit measures
         six washes against a 3:1 floor and every one fails it, so a scale fit only to the
         data (max 1.333) put the marker at left:225%, off the track and off the card.
         Scaling to whichever is larger keeps the marker on the same 0-100% line the bars
         are on, which is also the honest picture: the floor sits visibly out of reach. */
      var max = Math.max.apply(null, b.data.map(function (d) { return Math.abs(Number(d[1])) || 0; })
        .concat([b.threshold != null ? Math.abs(Number(b.threshold)) || 0 : 0])) || 1;
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



  var toastT = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove('on'); }, 1600);
  }

  /* ── the right rail ───────────────────────────────────────────────────────
     Ported from the tred decisions rail. Four things that were previously either
     absent or buried on another screen: how far along you are, one click to the next
     unanswered question, the export, and a grid of every id so any question is one
     click away. The old rail showed metadata about the card you were already reading,
     which is the one thing you do not need help finding. */
  function answeredList() { return Q.filter(function (q) { return isDone(q.id); }); }
  function nextUnanswered(fromId) {
    var V = VIS(), i = fromId ? V.findIndex(function (q) { return q.id === fromId; }) : -1;
    var open = function (q) { return focus() ? needsYou(q.id) : isOpen(q.id); };
    for (var k = i + 1; k < V.length; k++) if (open(V[k])) return V[k];
    for (var j = 0; j <= i && j < V.length; j++) if (open(V[j])) return V[j];
    return null;
  }
  function rlist(items, n) {
    return '<ul class="rlist">' + items.slice(0, n).map(function (q) {
      return '<li><button data-q="' + esc(q.id) + '"><span class="rid">' + esc(q.id) + '</span>' +
        esc(q.q) + '</button></li>';
    }).join('') +
      (items.length > n ? '<li class="rmore">and ' + (items.length - n) + ' more</li>' : '') + '</ul>';
  }
  function jumpGrid(currentId) {
    if (focus()) {
      return '<div class="rsec jump"><div class="rh">The ' + MLIST.length + ' for the meeting</div><div class="jumpgrid">' +
        MLIST.map(function (id) {
          var src = ROOT_BY[id] || QBY[id]; if (!src) return '';
          return '<button class="jcell' + (needsYou(id) ? '' : ' done') + (id === currentId ? ' on' : '') +
            '" data-' + (ROOT_BY[id] ? 'root' : 'q') + '="' + esc(id) + '" title="' + esc(id + '. ' + src.q) + '">' + MEETN[id] + '</button>';
        }).join('') + '</div></div>';
    }
    var cats = [];
    Q.forEach(function (q) { if (cats.indexOf(q.cat) < 0) cats.push(q.cat); });
    return '<div class="rsec jump"><div class="rh">Jump to any question</div>' +
      cats.map(function (c) {
        var qs = Q.filter(function (q) { return q.cat === c; });
        return '<div class="jumpgrp"><div class="jumpcat">' + esc(c) + '</div><div class="jumpgrid">' +
          qs.map(function (q) {
            return '<button class="jcell' + (state.picks[q.id] ? ' done' : '') +
              (q.id === currentId ? ' on' : '') + (q.weight === 'critical' ? ' crit' : '') +
              '" data-q="' + esc(q.id) + '" title="' + esc(q.q) + '">' + esc(q.id) + '</button>';
          }).join('') + '</div></div>';
      }).join('') + '</div>';
  }
  function railCommon(currentId, currentIdx) {
    var crit = Q.filter(function (q) { return q.weight === 'critical'; });
    var critLeft = crit.filter(function (q) { return isOpen(q.id); });
    var differ = Q.filter(function (q) { return STATUS[q.id] === 'overruled'; });
    var reopened = Q.filter(function (q) { return STATUS[q.id] === 'reopened'; });
    var noted = Q.filter(function (q) { return (state.notes[q.id] || '').trim(); });
    var up = nextUnanswered(currentId);
    var ro = rootsOpen(), taken = countOf(Q, 'taken');
    /* The ring counts what is the founders' to answer. In focus that is the meeting set,
       where a taken card nobody has confirmed still counts as waiting. Otherwise it is the
       roots, the facts, and whatever their answers re-opened; the taken cards are progress
       already made, not a backlog, so they sit under the ring as a line. */
    var yTotal = focus() ? MLIST.length : ROOTS.length + FACTS.length + reopened.length;
    var yDone = focus() ? meetAnswered() : (ROOTS.length - ro.length) + FACTS.filter(function (id) { return state.picks[id]; }).length;

    var h = '<div class="rsec ring-sec">' +
      /* The two numbers share a baseline, so they need a box of their own: baseline
         alignment on the ring itself pinned the pair to the top of the circle. */
      '<div class="ring" style="--p:' + (yTotal ? yDone / yTotal : 0) + '">' +
        '<span class="rval"><span class="rnum">' + yDone + '</span>' +
        '<span class="rden">/ ' + yTotal + '</span></span></div>' +
      '<p class="rlab">' + (yTotal - yDone) + (focus() ? ' of the ' + MLIST.length + ' still need you' : ' left that only you can answer') + '</p>' +
      '<p class="rsub">' + (focus() ? (Q.length - VIS().length) + ' other cards hidden' : taken + ' taken on the evidence') +
        (differ.length ? ' · ' + differ.length + ' overruled' : '') +
        (reopened.length ? ' · ' + reopened.length + ' re-opened' : '') + '</p>' +
      (up ? '<button class="rbtn" data-q="' + esc(up.id) + '">Go to the next open card</button>' : '') +
      (ro.length ? '<button class="rbtn' + (up ? ' ghost' : '') + '" data-ov="1">' + ro.length + ' decision' + (ro.length === 1 ? '' : 's') + ' open on the overview</button>' : '') +
      (!up && !ro.length ? '<p class="rdone">Nothing open. Export it.</p>' : '') +
      '</div>';
    if (reopened.length) {
      h += '<div class="rsec"><div class="rh">Re-opened by your answers</div>' +
        '<p class="rsub">taken under an answer that has changed</p>' + rlist(reopened, 6) + '</div>';
    }

    h += '<div class="rsec"><div class="rh">Your answers are saved</div>' +
      '<p class="rsub">In this browser only. Export after every sitting.</p>' +
      '<button class="rlink" data-action="expjson"><span class="rm">JSON</span>Download every answer and note</button>' +
      '<button class="rlink" data-action="expmd"><span class="rm">Markdown</span>What is decided, and what is open</button>' +
      '<button class="rlink" data-action="impjson"><span class="rm">Restore</span>Load a JSON export back in</button></div>';

    if (critLeft.length) {
      h += '<div class="rsec"><div class="rh">Critical, still open</div>' +
        '<p class="rsub">' + (crit.length - critLeft.length) + ' of ' + crit.length + ' settled</p>' +
        rlist(critLeft, 7) + '</div>';
    }
    if (differ.length) {
      h += '<div class="rsec"><div class="rh">You overruled the take</div>' +
        '<p class="rsub">worth talking through</p>' + rlist(differ, 6) + '</div>';
    }
    if (noted.length) {
      h += '<div class="rsec"><div class="rh">With notes</div>' + rlist(noted, 6) + '</div>';
    }
    return h;
  }
  function railFor(q, idx, pick) {
    var h = railCommon(q.id, idx);
    var V = VIS(), vin = V.indexOf(q) > -1;
    h += '<div class="rsec"><div class="rh">This decision</div>' +
      '<div class="rrow"><span>Position</span><b>' + (focus() && MEETN[q.id] ? 'question ' + MEETN[q.id] + ' of ' + MLIST.length :
        (idx + 1) + ' of ' + (vin ? V.length : Q.length)) + '</b></div>' +
      '<div class="rrow"><span>Weight</span><b>' + esc(q.weight || 'none') + '</b></div>' +
      '<div class="rrow"><span>Area</span><b>' + esc(q.cat) + '</b></div>' +
      '<div class="rrow"><span>Status</span><b style="color:var(--' + (isDone(q.id) ? 'good' : 'high') + ')">' +
      esc({ taken: 'taken ' + String(q.rec).toUpperCase(), reopened: 're-opened', overruled: 'overruled, ' + String(pick).toUpperCase(),
        answered: 'answered ' + String(pick).toUpperCase(), fact: 'a fact, open' }[STATUS[q.id]] || 'open') + '</b></div>' +
      (WHEN[q.when] ? '<div class="rrow"><span>Stage</span><b>' + esc(WHEN[q.when]) + '</b></div>' : '') +
      '</div>';
    if (q.sources && q.sources.length) {
      h += '<div class="rsec"><div class="rh">Where this came from</div>' +
        q.sources.map(function (s) { return '<span class="src">' + esc(s) + '</span>'; }).join('') + '</div>';
    }
    return h + jumpGrid(q.id);
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

  var DETAIL = { low: 'Low', med: 'Medium', high: 'High' };
  function renderQ(q) {
    /* The pager runs over what is visible: the meeting set in its numbered order in focus,
       every card otherwise. A hidden card opened from its link pages through everything. */
    var list = VIS(); if (list.indexOf(q) < 0) list = Q;
    var idx = list.indexOf(q), prev = list[idx - 1], next = list[idx + 1], pick = state.picks[q.id];
    var wc = q.weight === 'critical' ? 'crit' : q.weight === 'high' ? 'high' : '';
    var inCat = Q.filter(function (x) { return x.cat === q.cat; });
    var catIdx = inCat.indexOf(q) + 1;
    /* Three levels of the same card, not three different cards: low is the question, the
       diagram and the options with one line each, enough to answer from. Medium adds the
       state/tension the question sits in, the option-by-option cost and the case for the
       recommendation. High adds the exhibits and the reasoning in full. Nothing here is
       ever hidden for good \u2014 a reader who wants more clicks once and every later card
       opens at that level, because re-choosing it 203 times is not a real option. */
    var lvl = state.detail[q.id] || state.detailDefault || 'low';
    var med = lvl === 'med' || lvl === 'high', high = lvl === 'high';
    var st = STATUS[q.id];
    var h = '';

    h += '<div class="card-q w-' + esc(q.weight || 'medium') + '">';
    h += '<div class="pos"><span class="eyebrow">' + (focus() && MEETN[q.id] ? 'Question ' + MEETN[q.id] + ' of ' + MLIST.length :
        'Decision ' + (idx + 1) + ' of ' + list.length) + '</span>' +
      '<span class="dotsep">\u00b7</span><span class="eyebrow">' + esc(q.cat) + ' ' + catIdx + '/' + inCat.length + '</span></div>';
    h += '<div class="qhead">' + (MEETN[q.id] ? '<span class="pill meet">Question ' + MEETN[q.id] + ' of ' + MLIST.length + '</span>' : '') +
      '<span class="pill id">' + esc(q.id) + '</span>' +
      '<span class="pill">' + esc(q.cat) + (q.sub ? ' \u00b7 ' + esc(q.sub) : '') + '</span>' +
      (q.weight && q.weight !== 'medium' ? '<span class="pill ' + wc + '">' + esc(q.weight) + '</span>' : '') +
      (WHEN[q.when] ? '<span class="pill when when-' + esc(q.when) + '">' + esc(WHEN[q.when]) + '</span>' : '') +
      (st === 'taken' ? '<span class="pill taken">taken ' + esc(q.rec).toUpperCase() + '</span>' :
       st === 'reopened' ? '<span class="pill reopen">re-opened</span>' :
       st === 'overruled' ? '<span class="pill over">overruled ' + esc(pick).toUpperCase() + '</span>' :
       st === 'answered' ? '<span class="pill done">' + icon('check') + ' answered ' + esc(pick).toUpperCase() + '</span>' :
       '<span class="pill">a fact, open</span>') +
      '<span class="dtoggle" role="radiogroup" aria-label="How much detail">' +
      ['low', 'med', 'high'].map(function (k) {
        return '<button class="dbtn' + (lvl === k ? ' on' : '') + '" data-detail="' + k +
          '" role="radio" aria-checked="' + (lvl === k) + '">' + DETAIL[k] + '</button>';
      }).join('') + '</span></div>';
    h += '<h1 class="q">' + md(q.q) + '</h1>';
    if (q.lede) h += '<p class="lede">' + md(q.lede) + '</p>';

    if (q.visual && window.Diagram) h += window.Diagram.render(q.visual);

    if (q.stakes) h += '<div class="stakes">' + icon('warning', 'si') +
      '<span><b>If this goes the wrong way.</b> ' + md(q.stakes) + '</span></div>';

    /* The take, and what it assumed. Shown before the options because the reader's first
       question is whether this is settled, and on what. A chip per assumption: a root or
       a card, the answer assumed, and, if that answer has since changed, what it is now. */
    var ds = DEPS[q.id] || [], broken = brokenDeps(q.id);
    var depChip = function (d) {
      var isR = !!ROOT_BY[d[0]], ok = depOk(d), now = effective(d[0]);
      return '<button class="tchip' + (ok ? '' : ' bad') + '" data-' + (isR ? 'root' : 'q') + '="' + esc(d[0]) + '"><b>' + esc(d[0]) + '</b>' +
        esc(d[1]).toUpperCase() + ': ' + esc(labelOf(d[0], d[1])) +
        (ok ? '' : '<i>now ' + (now ? esc(String(now)).toUpperCase() + (now === 'own' ? '' : ': ' + esc(labelOf(d[0], now))) : 'open') + '</i>') + '</button>';
    };
    var rc = Array.isArray(q.recCase) && q.recCase.length ? q.recCase[0] : '';
    if (st === 'taken') {
      h += '<div class="takenbar">' + icon('check') + '<span><b>Taken on the evidence: ' + esc(q.rec).toUpperCase() + '.</b> ' + md(rc) +
        ' Choose another option below to overrule it.' +
        (ds.length ? '<span class="tchips"><span class="tlab">Assumes</span>' + ds.map(depChip).join('') + '</span>' : '') + '</span></div>';
    } else if (st === 'reopened') {
      h += '<div class="takenbar warn">' + icon('warning') + '<span><b>Re-opened.</b> This card was taken assuming an answer that has since changed. Choose again, or put the upstream answer back.' +
        '<span class="tchips"><span class="tlab">Changed</span>' + broken.map(depChip).join('') + '</span></span></div>';
    } else if (st === 'overruled') {
      h += '<div class="takenbar">' + icon('lightbulb') + '<span><b>Overruled.</b> You chose ' + esc(pick).toUpperCase() + ' against the take, ' + esc(q.rec).toUpperCase() + '. ' +
        '<button class="tlink" data-reset="1">Reset to the take</button></span></div>';
    } else if (st === 'answered' && !isFact(q.id)) {
      h += '<div class="takenbar">' + icon('check') + '<span><b>Confirmed ' + esc(pick).toUpperCase() + '.</b> The take, chosen by you. ' +
        '<button class="tlink" data-reset="1">Back to taken</button></span></div>';
    } else if (isFact(q.id)) {
      h += '<div class="takenbar fact">' + icon('lightbulb') + '<span><b>A fact only you know.</b> Not taken on the evidence. Answer it yourself, and the cards that assume it follow.</span></div>';
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
      /* The state a question sits in is medium depth, not low: low is meant to be
         answerable from the question and the options alone. */
      if (med && cols.length) h += '<div class="ctx">' + cols.join('') + '</div>';

    if (high && q.evidence && q.evidence.length) {
      h += '<details class="ev"><summary>' + icon('chevron_right', 'caret') + 'Evidence' +
        '<span class="cnt">' + q.evidence.length + ' ' + (q.evidence.length === 1 ? 'exhibit' : 'exhibits') + '</span></summary>' +
        '<div class="evbody">' + q.evidence.map(evBlock).join('') + '</div></details>';
      }

      /* Screen iterations bound to this decision. Each one is a real alternative for the
         surface the card decides, not decoration -- clicking opens it full size in a new tab. */
      if (high && window.MOCKUPS) {
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

      if (high && q.dupes && q.dupes.dropped && q.dupes.dropped.length) {
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
        (med && (o.gains || o.costs) ? '<span class="gc">' +
          '<span class="gcc gain"><span class="gch">Gains</span>' + bullets(o.gains, 'bl tight') + '</span>' +
          '<span class="gcc cost"><span class="gch">Costs</span>' + bullets(o.costs, 'bl tight') + '</span></span>' : '') +
        (med && meta.length ? '<span class="ometa">' + meta.map(function (m) {
          return '<span class="om"><b>' + m[0] + '</b> ' + md(m[1]) + '</span>';
        }).join('') + '</span>' : '') +
        '</span></button>';
    });
    h += '</div>';

    /* recCase is the sixty-second argument, medium depth; recWhy and flip are the
       reasoning in full and what would reverse it, high only. */
    if (med && q.recCase) {
      h += '<div class="reccase"><div class="rh">' + icon('lightbulb') +
        'Why ' + esc(String(q.rec).toUpperCase()) + '</div>' +
        (Array.isArray(q.recCase) ? bullets(q.recCase) : md(q.recCase)) +
        (high && q.recWhy ? '<details class="recwhy" open><summary>The reasoning in full</summary><div class="recwhyb">' + md(q.recWhy) + '</div></details>' : '');
      if (high && q.flip) h += '<div class="flip"><b>What would change this answer.</b> ' + md(q.flip) + '</div>';
      h += '</div>';
    }

    if (med && q.linked && q.linked.length) {
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
      h += '<button class="go' + (isDone(q.id) ? ' primary' : '') + '" data-q="' + esc(next.id) + '">' +
        '<span class="gt">' + (isDone(q.id) ? 'Next card' : 'Skip for now') + '</span>' +
        '<span class="gk">or press <kbd>\u21b5</kbd></span>' + icon('arrow_forward') + '</button>';
    } else {
      h += '<button class="go" data-ov="1"><span class="gt">Back to the overview</span></button>';
    }
    h += '</div>';
    $('#main').innerHTML = h;
    $('#main').scrollTop = 0;

    $('#aside').innerHTML = railFor(q, idx, pick);
    $('#abarPos').innerHTML = '<b>' + esc(q.id) + '</b>' + (focus() && MEETN[q.id] ? MEETN[q.id] + ' of ' + MLIST.length : (idx + 1) + ' of ' + list.length);
    $('#abarPrev').disabled = !prev; $('#abarNext').disabled = !next;
  }

  /* ── overview ─────────────────────────────────────────────────────────── */
  function renderOverview() {
    var groups = cats(), a = answered(Q), c = crit(Q);
    var ev = Q.reduce(function (n, q) { return n + (q.evidence || []).length; }, 0);
    var tagged = Q.filter(function (q) { return WHEN[q.when]; });
    var openIn = function (k) { return Q.filter(function (q) { return q.when === k && isOpen(q.id); }); };
    var ro = rootsOpen(), reopened = Q.filter(function (q) { return STATUS[q.id] === 'reopened'; });
    var factsOpen = FACTS.filter(function (id) { return QBY[id] && !state.picks[id]; });
    var taken = countOf(Q, 'taken'), over = countOf(Q, 'overruled');
    var yours = ro.length + factsOpen.length + reopened.length;
    var fo = focus(), h;
    var toggle = MLIST.length ? '<p class="ovtoggle">' + (fo
      ? (Q.length - VIS().length) + ' other cards are answered on their recommendation and hidden. <button class="tlink" data-action="toggleall">Show all ' + Q.length + '</button>'
      : 'Showing all ' + Q.length + ' cards. <button class="tlink" data-action="toggleall">Show only the ' + MLIST.length + ' for the meeting</button>') + '</p>' : '';
    if (fo) {
      var mDone = meetAnswered(), mRootsOpen = ro.length;
      var mFacts = MLIST.filter(function (id) { return isFact(id); }).length;
      var mTaken = MLIST.filter(function (id) { return QBY[id] && STATUS[id] === 'taken'; }).length;
      var mOver = MLIST.filter(function (id) { return STATUS[id] === 'overruled'; }).length;
      var mTakenAll = MLIST.length - ROOTS.length - mFacts;
      h = '<div class="hero"><span class="eyebrow">Studio Zephyrus · frontmatter</span>' +
        '<h1>' + MLIST.length + ' questions for the meeting</h1>' +
        '<p>' + ROOTS.length + ' decisions, ' + mFacts + ' facts, and ' + mTakenAll + ' cards taken on the evidence, each waiting for you ' +
        'to confirm or overrule. Every one is numbered, here and on its card. Answers stay in this browser. ' +
        '<a class="gallerylink" href="mockups.html" target="_blank" rel="noopener">See the screen iterations</a></p></div>';
      h += '<div class="kpis">' +
        '<div class="kpi acc"><div class="kn">Answered by you</div><div class="kv">' + mDone + '</div><div class="kn">of ' + MLIST.length + '</div></div>' +
        '<div class="kpi' + (mRootsOpen ? ' crit' : '') + '"><div class="kn">Decisions open</div><div class="kv">' + mRootsOpen + '</div><div class="kn">of ' + ROOTS.length + ', below</div></div>' +
        '<div class="kpi"><div class="kn">To confirm</div><div class="kv">' + mTaken + '</div><div class="kn">taken, not yet yours</div></div>' +
        '<div class="kpi"><div class="kn">Overruled</div><div class="kv">' + mOver + '</div><div class="kn">by you, against the take</div></div></div>';
      h += toggle;
    } else {
      h = '<div class="hero"><span class="eyebrow">Studio Zephyrus · frontmatter</span>' +
        '<h1>' + ROOTS.length + ' decisions and ' + FACTS.length + ' facts</h1>' +
        '<p>That is what is yours. The other ' + (Q.length - FACTS.length) + ' cards are taken on the evidence already ' +
        'on them, each with its reason, and any one can be overruled. A taken card re-opens by itself when an ' +
        'answer it assumed changes, so nothing stays quietly settled on a premise you have moved. ' +
        (MLIST.length ? 'The ' + MLIST.length + ' critical product and business calls are numbered on every screen. ' : '') +
        'Answers stay in this browser. ' +
        '<a class="gallerylink" href="mockups.html" target="_blank" rel="noopener">See the screen iterations</a></p></div>';
      h += '<div class="kpis">' +
        '<div class="kpi acc"><div class="kn">Yours, still open</div><div class="kv">' + yours + '</div>' +
          '<div class="kn">' + ro.length + ' decision' + (ro.length === 1 ? '' : 's') + ', ' + factsOpen.length + ' fact' + (factsOpen.length === 1 ? '' : 's') +
          (reopened.length ? ', ' + reopened.length + ' re-opened' : '') + '</div></div>' +
        '<div class="kpi"><div class="kn">Taken</div><div class="kv">' + taken + '</div>' +
          '<div class="kn">on the evidence, overrulable</div></div>' +
        '<div class="kpi' + (over ? ' crit' : '') + '"><div class="kn">Overruled</div><div class="kv">' + over + '</div>' +
          '<div class="kn">by you, against the take</div></div>' +
        '<div class="kpi"><div class="kn">Evidence</div><div class="kv">' + ev + '</div>' +
          '<div class="kn">exhibits behind them</div></div></div>';
      h += toggle;
    }
    if (MLIST.length) {
      /* The meeting set, numbered. A row per question: its number, its id, the question,
         the answer it currently carries, and whether that answer is the founders' or a
         take waiting on them. Roots link to their section below; cards open the card. */
      var mSettled = MLIST.filter(function (id) { return ROOT_BY[id] ? !!rootAnswer(id) : !!state.picks[id]; }).length;
      h += '<h2 class="sech">' + esc(MEET.title || 'For the meeting') + '</h2><p class="secn">' + esc(MEET.note || '') + ' ' +
        mSettled + ' of ' + MLIST.length + ' answered by you.</p><div class="qlist">' +
        MLIST.map(function (id, i) {
          var isR = !!ROOT_BY[id], src = isR ? ROOT_BY[id] : QBY[id]; if (!src) return '';
          var st, lab, tag, cls;
          if (isR) {
            var ra = rootAnswer(id);
            st = ra ? 'done' : 'open'; tag = ra ? 'answered' : 'open';
            lab = ra ? (ra === 'own' ? 'your own line' : ra.toUpperCase() + '. ' + labelOf(id, ra)) : 'decide below';
          } else {
            var s = STATUS[id], k = state.picks[id] || (s === 'taken' ? src.rec : null);
            st = s === 'taken' ? 'taken' : (s === 'fact' || s === 'reopened') ? 'open' : 'done';
            tag = s === 'taken' ? 'taken, confirm or overrule' : s === 'reopened' ? 're-opened' : s === 'overruled' ? 'overruled' :
              s === 'fact' ? 'a fact, open' : 'confirmed';
            lab = k ? k.toUpperCase() + '. ' + labelOf(id, k) : 'open';
          }
          return '<button class="ql meet ' + st + '" data-' + (isR ? 'root' : 'q') + '="' + esc(id) + '">' +
            mnum(id) + '<span class="qq"><span class="qi">' + esc(id) + '</span>' + esc(src.q) +
            '<span class="aa' + (st === 'taken' ? ' muted' : st === 'open' ? ' warn' : '') + '">' + esc(lab) + '</span></span>' +
            '<span class="qc">' + esc(tag) + '</span></button>';
        }).join('') + '</div>';
    }
    if (ROOTS.length) {
      /* The three roots. Each is answered with an option, or the founder's own line, and
         each settles a set of cards underneath it; those chips turn to re-opened the moment
         the answer differs from the one they were taken under. */
      h += '<h2 class="sech">Decisions only you can take</h2><p class="secn">Each one settles the cards under it. ' +
        'The recommendation is marked. Choose it, choose against it, or write your own line. ' +
        (ROOTS.length - ro.length) + ' of ' + ROOTS.length + ' answered.</p>';
      ROOTS.forEach(function (d) {
        var ans = state.final[d.id] || {}, k = ans.k;
        h += '<div class="fq' + (rootAnswer(d.id) ? ' done' : '') + '" id="root-' + esc(d.id) + '">' +
          '<div class="fqh">' + mnum(d.id) + '<span class="fqid">' + esc(d.id) + '</span><span class="fqt">' + esc(d.title) + '</span></div>' +
          '<div class="fqp">' + esc(d.q) + '</div>' +
          '<div class="fopts" role="radiogroup" aria-label="' + esc(d.title) + '">' + d.options.map(function (o) {
            return '<button class="fopt' + (o.k === d.rec ? ' rec' : '') + (k === o.k ? ' on' : '') +
              '" data-root-opt="' + esc(o.k) + '" data-fq="' + esc(d.id) + '" role="radio" aria-checked="' + (k === o.k) + '">' +
              '<span class="k">' + esc(o.k) + '</span><span class="ob"><span class="ol">' + esc(o.label) +
              (o.k === d.rec ? '<span class="rectag">recommended</span>' : '') + '</span>' +
              (o.what ? '<span class="ow">' + esc(o.what) + '</span>' : '') + '</span></button>';
          }).join('') + '</div>' +
          '<div class="fqe"><b>Why ' + esc(d.rec).toUpperCase() + '.</b> ' + esc(d.why) + '</div>' +
          '<div class="fqe">' + esc(d.evidence) + '</div>' +
          '<div class="fqc"><span class="tlab">Settles</span>' + (d.settles || []).map(function (id) {
            var q = QBY[id]; if (!q) return '';
            return '<button class="jcell' + (isDone(id) ? ' done' : '') + (STATUS[id] === 'reopened' ? ' warn' : '') +
              '" data-q="' + esc(id) + '" title="' + esc(q.q) + '">' + esc(id) + '</button>';
          }).join('') + '</div>' +
          '<div class="fqa"><input class="fown" data-fq="' + esc(d.id) + '" placeholder="or your own line, and why" value="' + esc(ans.own || '') + '"></div>' +
          '</div>';
      });
    }
    if (FACTS.length && !fo) {
      h += '<h2 class="sech">' + esc(FINAL.facts.title) + '</h2><p class="secn">' + esc(FINAL.facts.note) + '</p><div class="qlist">' +
        FACTS.map(function (id) {
          var q = QBY[id]; if (!q) return '';
          var o = (q.options || []).filter(function (x) { return x.k === state.picks[id]; })[0];
          return '<button class="ql' + (state.picks[id] ? ' done' : '') + '" data-q="' + esc(id) + '">' +
            '<span class="qi">' + esc(id) + '</span><span class="qq">' + esc(q.q) +
            (o ? '<span class="aa">' + icon('check', 's') + esc(o.label) + '</span>' : '') + '</span>' +
            '<span class="qc">' + (state.picks[id] ? 'answered' : 'open') + '</span></button>';
        }).join('') + '</div>';
    }
    if (reopened.length) {
      h += '<h2 class="sech">Re-opened by your answers</h2><p class="secn">Each of these was taken assuming an answer ' +
        'you have since changed. Choose again, or put the upstream answer back.</p><div class="qlist">' +
        reopened.map(function (q) {
          var b = brokenDeps(q.id);
          return '<button class="ql" data-q="' + esc(q.id) + '"><span class="qi">' + esc(q.id) + '</span>' +
            '<span class="qq">' + esc(q.q) + '<span class="aa warn">assumed ' +
            b.map(function (d) { return esc(d[0]) + ' = ' + esc(d[1]).toUpperCase(); }).join(', ') + '</span></span>' +
            '<span class="qc">' + esc(q.cat) + '</span></button>';
        }).join('') + '</div>';
    }
    if (tagged.length && !fo) {
      /* Each card is tagged with the point at which its answer is needed. With the takes in
         place this reads as a build sequence rather than a backlog: what each stage assumes
         is settled, and whether anything in it has re-opened. */
      h += '<h2 class="sech">By stage</h2><p class="secn">Each card is tagged by the point at which its answer ' +
        'is needed. A stage with nothing open can be built.</p>';
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
    if (CHORES.length && !fo) {
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
    if (!fo) {
      h += '<h2 class="sech">By area</h2><p class="secn">Ordered the way the plan reads, not the way they were found.</p>';
      h += '<div class="grid">' + groups.map(function (g) {
        var ga = answered(g.qs), gc = crit(g.qs), pct = g.qs.length ? (ga / g.qs.length) * 100 : 0;
        return '<button class="cat" data-cat="' + esc(g.cat) + '">' +
          '<div class="ct">' + esc(g.cat) + '</div>' +
          '<div class="cs"><span>' + ga + ' of ' + g.qs.length + '</span>' +
          (gc ? '<span class="cc">' + gc + ' critical</span>' : '') + '</div>' +
          '<div class="cbar"><i style="width:' + pct + '%"></i></div></button>';
      }).join('') + '</div>';
    }
    /* Start here: the earliest stage that still has open cards, critical first. Untagged sets keep
       the old list of critical open cards. */
    var stage = null, openCrit;
    if (tagged.length) {
      for (var si = 0; si < WHEN_ORDER.length && !stage; si++) if (openIn(WHEN_ORDER[si]).length) stage = WHEN_ORDER[si];
      openCrit = stage ? openIn(stage).slice().sort(function (x, y) {
        return (RANK[x.weight] || 3) - (RANK[y.weight] || 3);
      }).slice(0, 12) : [];
    } else {
      openCrit = Q.filter(function (q) { return q.weight === 'critical' && isOpen(q.id); }).slice(0, 10);
    }
    if (openCrit.length && !fo) {
      h += stage
        ? '<h2 class="sech">Open cards: ' + esc(WHEN[stage].charAt(0).toLowerCase() + WHEN[stage].slice(1)) +
          '</h2><p class="secn">Facts and re-opened cards, critical first.</p><div class="qlist">'
        : '<h2 class="sech">Open cards</h2><p class="secn">Critical and open. A wrong answer to any of ' +
          'these costs the product or the company.</p><div class="qlist">';
      h += openCrit.map(function (q) {
        return '<button class="ql" data-q="' + esc(q.id) + '">' +
          '<span class="qi">' + esc(q.id) + '</span>' +
          '<span class="qq">' + esc(q.q) + '</span>' +
          '<span class="qc">' + esc(q.cat) + '</span></button>';
      }).join('') + '</div>';
    }
    $('#main').innerHTML = h; $('#main').scrollTop = 0;
    $('#aside').innerHTML = railCommon(null, null) +
      '<div class="rsec"><div class="rh">Keyboard</div>' +
      '<div class="rrow"><span>Next / previous</span><b class="mono">j k</b></div>' +
      '<div class="rrow"><span>Choose an option</span><b class="mono">a–d</b></div>' +
      '<div class="rrow"><span>Search</span><b class="mono">/</b></div></div>';
    $('#abarPos').innerHTML = fo ? '<b>' + meetAnswered() + ' / ' + MLIST.length + '</b>answered by you' : '<b>' + yours + '</b>yours open';
  }

  /* ── one area: every question in it, with its state ──────────────────────
     Graphite groups its review inbox by state with a count per group, and that
     reads better at scale than dropping someone into question one of thirty-four. */
  function renderArea(cat) {
    var qs = Q.filter(function (x) { return x.cat === cat; });
    var a = answered(qs), c = crit(qs);
    var open = qs.filter(function (q) { return isOpen(q.id); });
    var over = qs.filter(function (q) { return STATUS[q.id] === 'overruled'; });
    var conf = qs.filter(function (q) { return STATUS[q.id] === 'answered'; });
    var taken = qs.filter(function (q) { return STATUS[q.id] === 'taken'; });
    var row = function (q) {
      var st = STATUS[q.id], k = state.picks[q.id] || (st === 'taken' ? q.rec : null);
      var o = (q.options || []).filter(function (x) { return x.k === k; })[0];
      return '<button class="ar' + (isDone(q.id) ? ' done' : '') + (st === 'taken' ? ' taken' : '') +
        (q.weight === 'critical' ? ' crit' : q.weight === 'high' ? ' high' : '') +
        '" data-q="' + esc(q.id) + '">' +
        '<span class="ai">' + mnum(q.id, 's') + esc(q.id) + '</span>' +
        '<span class="aq">' + esc(q.q) +
        (o ? '<span class="aa">' + icon('check', 's') + esc(o.label) + '</span>' : '') + '</span>' +
        '<span class="aw">' + esc(st === 'taken' ? 'taken' : st === 'reopened' ? 're-opened' : st === 'overruled' ? 'overruled' :
          st === 'answered' ? '' : (q.weight || '')) + '</span></button>';
    };
    /* Taken cards in the meeting set stay visible: they are waiting on the founders to
       confirm or overrule, which is not the same as settled. The rest fold away. */
    var takenMeet = taken.filter(function (q) { return MEETN[q.id]; });
    taken = taken.filter(function (q) { return !MEETN[q.id]; });
    var h = '<div class="hero"><span class="eyebrow">Area ' + (cats().map(function (g) { return g.cat; }).indexOf(cat) + 1) +
      ' of ' + cats().length + '</span><h1>' + esc(cat) + '</h1>' +
      '<p>' + qs.length + ' cards · ' + open.length + ' open · ' + taken.length + ' taken · ' +
      (over.length ? over.length + ' overruled · ' : '') + (c ? c + ' critical still open' : 'no critical left open') + '.</p></div>';
    if (open.length) {
      h += '<button class="go primary wide" data-q="' + esc(open[0].id) + '">' +
        '<span class="gt">Start with ' + esc(open[0].id) + '</span>' +
        '<span class="gk">' + esc(open.length) + ' open</span>' + icon('arrow_forward') + '</button>';
      h += '<h2 class="sech">Open</h2><div class="arlist">' + open.map(row).join('') + '</div>';
    }
    if (takenMeet.length) h += '<h2 class="sech">For the meeting, taken: confirm or overrule</h2><div class="arlist">' + takenMeet.map(row).join('') + '</div>';
    if (over.length) h += '<h2 class="sech">Overruled</h2><div class="arlist">' + over.map(row).join('') + '</div>';
    if (conf.length) h += '<h2 class="sech">Confirmed</h2><div class="arlist">' + conf.map(row).join('') + '</div>';
    if (taken.length) {
      h += '<details class="ev takenlist"><summary>' + icon('chevron_right', 'caret') + 'Taken on the evidence' +
        '<span class="cnt">' + taken.length + '</span></summary><div class="arlist">' + taken.map(row).join('') + '</div></details>';
    }
    $('#main').innerHTML = h; $('#main').scrollTop = 0;
    $('#aside').innerHTML = '<div class="rsec"><div class="rh">This area</div>' +
      '<div class="rrow"><span>Decisions</span><b>' + qs.length + '</b></div>' +
      '<div class="rrow"><span>Answered</span><b>' + a + '</b></div>' +
      '<div class="rrow"><span>Critical open</span><b style="color:var(--crit)">' + c + '</b></div></div>' +
      railCommon(null, null) + jumpGrid(null);
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
  function finalMd() {
    if (!ROOTS.length) return '';
    var out = [];
    if (MLIST.length) {
      out.push('## ' + (MEET.title || 'For the meeting'), '');
      MLIST.forEach(function (id, i) {
        var isR = !!ROOT_BY[id], src = isR ? ROOT_BY[id] : QBY[id]; if (!src) return;
        var k = isR ? rootAnswer(id) : (state.picks[id] || (STATUS[id] === 'taken' ? src.rec : null));
        var how = isR ? (k ? 'answered' : 'open') : STATUS[id] === 'taken' ? 'taken, not yet confirmed' : STATUS[id] === 'fact' ? 'open' : STATUS[id];
        out.push((i + 1) + '. **' + id + '** ' + src.q + ' | ' + (k ? (k === 'own' ? 'own line' : k.toUpperCase() + '. ' + labelOf(id, k)) : 'open') + ' | ' + how);
      });
      out.push('');
    }
    out.push('## Decisions', '');
    ROOTS.forEach(function (d) {
      var a = rootAnswer(d.id), s = state.final[d.id] || {};
      out.push('**' + d.id + '. ' + d.title + '**: ' + (a ? (a === 'own' ? 'own line' : a.toUpperCase() + '. ' + labelOf(d.id, a)) : 'open') +
        (s.own ? ' | ' + s.own : ''));
      out.push('');
    });
    out.push('## Facts', '');
    FACTS.forEach(function (id) {
      var q = QBY[id]; if (!q) return;
      var p = state.picks[id];
      out.push('- **' + id + '** ' + q.q + ' | ' + (p ? p.toUpperCase() + '. ' + labelOf(id, p) : 'open') +
        (state.notes[id] ? ' | ' + state.notes[id] : ''));
    });
    out.push('');
    return out.join('\n') + '\n';
  }
  function exportMd() {
    var over = Q.filter(function (q) { return STATUS[q.id] === 'overruled'; });
    var conf = Q.filter(function (q) { return STATUS[q.id] === 'answered' && !isFact(q.id); });
    var re = Q.filter(function (q) { return STATUS[q.id] === 'reopened'; });
    var taken = Q.filter(function (q) { return STATUS[q.id] === 'taken'; });
    var lines = ['# frontmatter decisions', '', yoursOpen() + ' left that only the founders can answer. ' +
      taken.length + ' taken on the evidence, ' + conf.length + ' confirmed, ' + over.length + ' overruled, ' + re.length + ' re-opened.', ''];
    var block = function (title, list, note) {
      if (!list.length) return;
      lines.push('## ' + title, '');
      if (note) lines.push(note, '');
      list.forEach(function (q) {
        var k = state.picks[q.id] || q.rec;
        lines.push('- **' + q.id + '** ' + q.q + ' | ' + String(k).toUpperCase() + '. ' + labelOf(q.id, k) +
          (state.notes[q.id] ? ' | ' + state.notes[q.id] : ''));
      });
      lines.push('');
    };
    block('Overruled', over, 'Chosen against the take.');
    block('Re-opened', re, 'Taken under an answer that has since changed. Still to choose again.');
    block('Confirmed', conf, 'The take, chosen by you.');
    block('Taken on the evidence', taken, 'Each on its own recommendation, with the reason on the card.');
    download('frontmatter-decisions.md', finalMd() + lines.join('\n'), 'text/markdown');
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
        /* The root answers travel with the export too; a file from before the roots
           existed simply has none, and an id that is not a root now is skipped. */
        var fin = data.final || {};
        Object.keys(fin).forEach(function (id) {
          if (!ROOT_BY[id] || !fin[id] || typeof fin[id] !== 'object') return;
          state.final[id] = { k: fin[id].k || undefined, own: fin[id].own || '' };
          if (!state.final[id].k) delete state.final[id].k;
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
    var a = answered(Q), c = crit(Q), n = Q.length || 1, y = yoursOpen();
    $('#prog').style.width = (a / n) * 100 + '%';
    $('#progCrit').style.width = (c / n) * 100 + '%';
    var here = '';
    if (view.mode === 'q' && view.cat) {
      var g = Q.filter(function (x) { return x.cat === view.cat; });
      here = '<span class="pcat">' + esc(view.cat) + ' ' + answered(g) + '/' + g.length + '</span>';
    }
    if (focus()) {
      var md_ = meetAnswered();
      $('#prog').style.width = (md_ / MLIST.length) * 100 + '%';
      $('#progCrit').style.width = (rootsOpen().length / MLIST.length) * 100 + '%';
      $('#progtxt').innerHTML = '<b>' + md_ + '</b> / ' + MLIST.length + ' answered by you';
      return;
    }
    $('#progtxt').innerHTML = here + '<b>' + y + '</b> yours open · ' + a + ' / ' + Q.length + ' settled' +
      (c ? ' · <b style="color:var(--crit)">' + c + '</b> critical' : '');
  }

  /* ── events ───────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var fb = e.target.closest('[data-root-opt]');
    if (fb) {
      /* A root option toggles: choosing it again clears it, which is the reset. */
      var gid = fb.getAttribute('data-fq'), kk = fb.getAttribute('data-root-opt');
      state.final[gid] = state.final[gid] || {};
      if (state.final[gid].k === kk) delete state.final[gid].k; else state.final[gid].k = kk;
      save(); renderOverview(); paintNav(); progress();
      var el = document.getElementById('root-' + gid); if (el) el.scrollIntoView({ block: 'nearest' });
      toast(state.final[gid].k ? 'Saved ' + gid + ' = ' + kk.toUpperCase() : gid + ' cleared'); return;
    }
    var t = e.target.closest('[data-q],[data-root],[data-reset],[data-cat],[data-ov],[data-import],[data-pick],[data-detail],[data-action],#mdgo,#mdsample,#menuBtn,#themeBtn,#abarPrev,#abarNext');
    if (!t) return;
    if (t.hasAttribute('data-reset')) {
      var qr = QBY[view.id]; if (!qr) return;
      delete state.picks[qr.id]; save(); renderQ(qr); paintNav(); progress(); toast('Back to the take'); return;
    }
    if (t.hasAttribute('data-root')) {
      var rid = t.getAttribute('data-root');
      go({ mode: 'overview', id: null });
      var rel = document.getElementById('root-' + rid); if (rel) rel.scrollIntoView({ block: 'start' });
      return;
    }
    if (t.id === 'menuBtn') { document.body.classList.toggle('navopen'); return; }
    if (t.id === 'themeBtn') { theme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); return; }
    /* data-action, not id: this same block of export/restore buttons now also renders
       inside the mobile nav drawer, where aside does not reach, and two elements
       cannot share one id. */
    var act = t.getAttribute('data-action');
    if (act === 'expmd') { exportMd(); return; }
    if (act === 'expjson') { download('frontmatter-decisions.json', JSON.stringify(state, null, 2), 'application/json'); return; }
    if (act === 'impjson') { restoreAnswers(); return; }
    if (act === 'toggletaken') { state.showTaken = !state.showTaken; save(); navShape = null; paintNav(); return; }
    if (act === 'toggleall') { state.showAll = !state.showAll; save(); navShape = null; go({}); toast(state.showAll ? 'Showing all ' + Q.length : 'Showing the ' + MLIST.length); return; }
    if (t.id === 'mdgo') { doImport(); return; }
    if (t.id === 'mdsample') { $('#mdin').value = $('#mdin').placeholder; doImport(); return; }
    if (t.id === 'abarPrev' || t.id === 'abarNext') { step(t.id === 'abarNext' ? 1 : -1); return; }
    if (t.hasAttribute('data-pick')) {
      var q = Q.filter(function (x) { return x.id === view.id; })[0];
      if (!q) return;
      state.picks[q.id] = t.getAttribute('data-pick'); save(); renderQ(q); paintNav(); progress();
      toast('Saved. ' + yoursOpen() + ' left that only you can answer'); return;
    }
    if (t.hasAttribute('data-detail')) {
      var qd = Q.filter(function (x) { return x.id === view.id; })[0];
      if (!qd) return;
      var lvl = t.getAttribute('data-detail');
      /* Setting a level carries forward to the next unvisited card, so choosing
         once at "high" does not mean re-clicking it 202 more times; it still
         starts every reader at "low" until they say otherwise. */
      state.detail[qd.id] = lvl; state.detailDefault = lvl; save(); renderQ(qd); return;
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
    var V = VIS(), i = V.findIndex(function (x) { return x.id === view.id; });
    if (i < 0) {
      /* Off the visible list: page through everything from here, or start at the top. */
      var j = Q.findIndex(function (x) { return x.id === view.id; });
      if (j < 0) { if (V.length) go({ mode: 'q', id: V[0].id }); return; }
      var m = Q[j + d]; if (m) go({ mode: 'q', id: m.id });
      return;
    }
    var n = V[i + d]; if (n) go({ mode: 'q', id: n.id });
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
  document.addEventListener('change', function (e) {
    var f = e.target.closest && e.target.closest('.fown');
    if (!f) return;
    var gid = f.getAttribute('data-fq'); state.final[gid] = state.final[gid] || {}; state.final[gid].own = f.value.trim();
    if (!state.final[gid].own) delete state.final[gid].own;
    /* An own line counts as an answer that is not the recommendation, so the cards taken
       under the recommendation re-open. The overview re-renders on change, not on input,
       so the field is not rebuilt under the caret. */
    save(); renderOverview(); paintNav(); progress(); toast('Saved ' + gid);
  });
  window.addEventListener('hashchange', function () {
    var v = fromHash();
    if (v.mode !== view.mode || v.id !== view.id || (v.mode === 'area' && v.cat !== view.cat)) go(v);
  });
})();
