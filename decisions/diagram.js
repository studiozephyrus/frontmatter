/* frontmatter — decisions · diagram renderer
 *
 * Every question carries a `visual` object. This turns that object into inline SVG.
 * Inline, because a decision page has to render with no network: on a plane, behind a
 * strict CSP, in a PDF, in an Artifact. Nine primitives, one accent, no emoji, no icon
 * font — the same rule the rest of the system runs on.
 *
 *   screen    a UI mockup: window chrome, panes, rows, a highlighted region
 *   flow      boxes and arrows — a sequence or a decision fork
 *   state     a state machine, with the current state marked
 *   compare   two or three columns held side by side
 *   ba        before and after, stacked or side by side
 *   arch      layers, bottom-up, with what sits in each
 *   timeline  dated events on a line
 *   matrix    a 2x2 with the field placed on it and us marked
 *   file      a markdown file with byte ranges marked
 *   funnel    counts narrowing step by step
 *
 * Colours come from CSS variables so the drawing follows the page's theme. Geometry is
 * computed, never hand-placed, so a longer label does not collide with the next box.
 */
(function (root) {
  'use strict';

  var W = 760;                        // viewBox width; height is computed per primitive
  var FS = 12.5;                      // base label size
  var PAD = 16;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Wrap by measured average character width. Not exact — SVG has no measurement before
     paint — but stable enough that boxes are sized from the text they will actually hold. */
  function wrap(text, widthPx, size) {
    var per = (size || FS) * 0.54;
    var max = Math.max(4, Math.floor(widthPx / per));
    var words = String(text || '').split(/\s+/).filter(Boolean);
    var lines = [], cur = '';
    words.forEach(function (w) {
      if (!cur.length) { cur = w; return; }
      if ((cur + ' ' + w).length <= max) cur += ' ' + w;
      else { lines.push(cur); cur = w; }
    });
    if (cur.length) lines.push(cur);
    return lines.length ? lines : [''];
  }

  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '"' +
      ' fill="' + (o.fill || 'var(--ink-2)') + '"' +
      ' font-size="' + (o.size || FS) + '"' +
      ' font-weight="' + (o.weight || 400) + '"' +
      (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.mono ? ' font-family="var(--mono)"' : ' font-family="var(--sans)"') +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') +
      '>' + esc(s) + '</text>';
  }

  function block(x, y, w, lines, o) {
    o = o || {};
    var lh = (o.size || FS) * 1.42;
    return lines.map(function (l, i) {
      return txt(x, y + i * lh, l, o);
    }).join('');
  }

  function rect(x, y, w, h, o) {
    o = o || {};
    return '<rect x="' + x + '" y="' + y + '" width="' + Math.max(0, w) + '" height="' + Math.max(0, h) + '"' +
      ' rx="' + (o.r == null ? 6 : o.r) + '"' +
      ' fill="' + (o.fill || 'var(--card)') + '"' +
      ' stroke="' + (o.stroke || 'var(--line)') + '"' +
      ' stroke-width="' + (o.sw || 1) + '"' +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
  }

  /* Tone is the only colour decision in the whole renderer. Four values, so a reader
     learns them once: neutral, the accent for what we are proposing, warn, and stop. */
  var TONE = {
    neutral: { fill: 'var(--card)', stroke: 'var(--line-2)', ink: 'var(--ink)' },
    sunk: { fill: 'var(--sunk)', stroke: 'var(--line)', ink: 'var(--ink-2)' },
    accent: { fill: 'var(--accent-soft)', stroke: 'var(--accent)', ink: 'var(--accent-ink)' },
    good: { fill: 'var(--good-soft)', stroke: 'var(--good)', ink: 'var(--good)' },
    warn: { fill: 'var(--high-soft)', stroke: 'var(--high)', ink: 'var(--high)' },
    stop: { fill: 'var(--crit-soft)', stroke: 'var(--crit)', ink: 'var(--crit)' },
  };
  function tone(t) { return TONE[t] || TONE.neutral; }

  function svg(h, body, label) {
    return '<figure class="dg">' +
      '<svg viewBox="0 0 ' + W + ' ' + Math.ceil(h) + '" role="img"' +
      (label ? ' aria-label="' + esc(label) + '"' : ' aria-hidden="true"') +
      ' preserveAspectRatio="xMidYMin meet">' +
      '<defs><marker id="dgar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0,1 L9,5 L0,9 z" fill="var(--ink-4)"/></marker>' +
      '<marker id="dgar-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0,1 L9,5 L0,9 z" fill="var(--accent)"/></marker></defs>' +
      body + '</svg>' +
      (label ? '<figcaption>' + esc(label) + '</figcaption>' : '') +
      '</figure>';
  }

  /* ── screen ──────────────────────────────────────────────────────────────
     A UI mockup. Panes laid left to right by weight, each holding rows. A row
     with mark:true gets the accent, which is how a mockup points at the thing
     the decision is about. */
  function screen(v) {
    var panes = v.panes || [];
    var totalW = panes.reduce(function (a, p) { return a + (p.w || 1); }, 0) || 1;
    var chromeH = 30;
    var rowsMax = panes.reduce(function (a, p) { return Math.max(a, (p.rows || []).length); }, 0);
    var bodyH = Math.max(120, 42 + rowsMax * 30);
    var h = PAD + chromeH + bodyH + PAD + (v.note ? 26 : 0);
    var out = '';

    out += rect(PAD, PAD, W - PAD * 2, chromeH + bodyH, { r: 9, fill: 'var(--card)', stroke: 'var(--line-2)' });
    out += rect(PAD, PAD, W - PAD * 2, chromeH, { r: 9, fill: 'var(--sunk)', stroke: 'none' });
    out += '<line x1="' + PAD + '" y1="' + (PAD + chromeH) + '" x2="' + (W - PAD) + '" y2="' + (PAD + chromeH) + '" stroke="var(--line)"/>';
    [0, 1, 2].forEach(function (i) {
      out += '<circle cx="' + (PAD + 18 + i * 13) + '" cy="' + (PAD + chromeH / 2) + '" r="3.6" fill="var(--line-2)"/>';
    });
    out += txt(PAD + 66, PAD + chromeH / 2 + 4, v.title || '', { size: 11.5, fill: 'var(--ink-3)', mono: true });

    var x = PAD;
    panes.forEach(function (p, pi) {
      var pw = (W - PAD * 2) * ((p.w || 1) / totalW);
      var py = PAD + chromeH;
      if (pi > 0) out += '<line x1="' + x + '" y1="' + py + '" x2="' + x + '" y2="' + (py + bodyH) + '" stroke="var(--line)"/>';
      if (p.label) out += txt(x + 14, py + 20, p.label.toUpperCase(), { size: 9.5, fill: 'var(--ink-4)', ls: '.09em', mono: true });
      (p.rows || []).forEach(function (r, ri) {
        var ry = py + 32 + ri * 30;
        var t = tone(r.tone || (r.mark ? 'accent' : 'sunk'));
        out += rect(x + 12, ry, pw - 24, 22, { r: 5, fill: t.fill, stroke: r.mark || r.tone ? t.stroke : 'none' });
        var lines = wrap(r.label || '', pw - 44, 11.5);
        out += txt(x + 20, ry + 15, lines[0] + (lines.length > 1 ? '…' : ''), {
          size: 11.5, fill: t.ink, weight: r.mark ? 600 : 400,
        });
        if (r.meta) out += txt(x + pw - 20, ry + 15, r.meta, { size: 10.5, fill: 'var(--ink-4)', anchor: 'end', mono: true });
      });
      x += pw;
    });

    if (v.note) out += txt(PAD, h - 8, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── flow ────────────────────────────────────────────────────────────────
     Boxes across, arrows between. Rows wrap at 4 nodes. A node's tone carries
     whether it is the recommended path, a refusal, or plain machinery. */
  function flow(v) {
    var nodes = v.nodes || [];
    var perRow = Math.min(4, Math.max(2, v.perRow || (nodes.length <= 3 ? nodes.length : 4)));
    var gap = 26;
    var bw = (W - PAD * 2 - gap * (perRow - 1)) / perRow;
    var rows = [];
    for (var i = 0; i < nodes.length; i += perRow) rows.push(nodes.slice(i, i + perRow));

    var laid = [], y = PAD;
    rows.forEach(function (row) {
      var hs = row.map(function (n) {
        var l = wrap(n.label, bw - 24, 12.5).length;
        var s = n.note ? wrap(n.note, bw - 24, 11).length : 0;
        return 18 + l * 18 + (s ? 4 + s * 15 : 0) + 14;
      });
      var rh = Math.max.apply(null, hs);
      row.forEach(function (n, ci) {
        laid.push({ n: n, x: PAD + ci * (bw + gap), y: y, w: bw, h: rh });
      });
      y += rh + 34;
    });
    var h = y - 34 + PAD + (v.note ? 24 : 0);

    var out = '';
    laid.forEach(function (b, i) {
      var t = tone(b.n.tone);
      out += rect(b.x, b.y, b.w, b.h, { fill: t.fill, stroke: t.stroke, r: 7, dash: b.n.dashed ? '4 3' : null });
      var ll = wrap(b.n.label, b.w - 24, 12.5);
      out += block(b.x + 12, b.y + 24, b.w, ll, { size: 12.5, weight: 600, fill: t.ink });
      if (b.n.note) {
        out += block(b.x + 12, b.y + 24 + ll.length * 18 + 12, b.w, wrap(b.n.note, b.w - 24, 11), { size: 11, fill: 'var(--ink-3)' });
      }
      // Arrow to the next node in the same row.
      var next = laid[i + 1];
      if (next && next.y === b.y) {
        var my = b.y + b.h / 2;
        var acc = b.n.tone === 'accent' || (next.n.tone === 'accent');
        out += '<line x1="' + (b.x + b.w + 5) + '" y1="' + my + '" x2="' + (next.x - 7) + '" y2="' + my +
          '" stroke="' + (acc ? 'var(--accent)' : 'var(--ink-4)') + '" stroke-width="1.4" marker-end="url(#' + (acc ? 'dgar-a' : 'dgar') + ')"/>';
        if (b.n.edge) {
          out += txt((b.x + b.w + next.x) / 2, my - 8, b.n.edge, { size: 10, anchor: 'middle', fill: 'var(--ink-4)', mono: true });
        }
      }
    });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── state ───────────────────────────────────────────────────────────────
     A row of states with the live one marked, plus the transition that moves
     between each. Used wherever a decision is really about a lifecycle. */
  function state(v) {
    var st = v.states || [];
    var gap = Math.max(34, Math.min(78, 12 + 6.2 * Math.max.apply(null,
      st.map(function (s) { return (s.via || '').length; }).concat([0]))));
    var bw = (W - PAD * 2 - gap * (st.length - 1)) / st.length;
    var bh = 62;
    var h = PAD + bh + 46 + PAD + (v.note ? 22 : 0);
    var out = '';
    st.forEach(function (s, i) {
      var x = PAD + i * (bw + gap);
      var t = tone(s.tone || (s.current ? 'accent' : 'neutral'));
      out += rect(x, PAD, bw, bh, { r: 30, fill: t.fill, stroke: t.stroke, sw: s.current ? 1.6 : 1 });
      var ll = wrap(s.label, bw - 20, 12.5);
      out += block(x + bw / 2, PAD + (bh / 2) - (ll.length - 1) * 8 + 4, bw, ll, {
        size: 12.5, weight: 600, anchor: 'middle', fill: t.ink,
      });
      if (s.meta) out += txt(x + bw / 2, PAD + bh + 17, s.meta, { size: 10.5, anchor: 'middle', fill: 'var(--ink-4)', mono: true });
      if (i < st.length - 1) {
        var my = PAD + bh / 2;
        out += '<line x1="' + (x + bw + 5) + '" y1="' + my + '" x2="' + (x + bw + gap - 7) + '" y2="' + my +
          '" stroke="var(--ink-4)" stroke-width="1.4" marker-end="url(#dgar)"/>';
        if (s.via) out += txt(x + bw + gap / 2, my - 13, s.via, { size: 9.5, anchor: 'middle', fill: 'var(--ink-4)', mono: true });
      }
    });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── compare ─────────────────────────────────────────────────────────────
     Columns held against each other on the same rows. The honest shape for
     "these are the options" — every column answers every row or says nothing. */
  function compare(v) {
    var cols = v.cols || [];
    var rowsN = v.rows || [];
    var gap = 14;
    var labW = v.labelWidth || 132;
    var cw = (W - PAD * 2 - labW - gap * cols.length) / cols.length;
    var headH = 40;

    var rowH = rowsN.map(function (r) {
      var m = 1;
      cols.forEach(function (c, ci) {
        m = Math.max(m, wrap((r.cells || [])[ci] || '', cw - 20, 11.5).length);
      });
      return Math.max(30, 12 + m * 16);
    });
    var h = PAD + headH + rowH.reduce(function (a, b) { return a + b; }, 0) + PAD + (v.note ? 22 : 0);
    var out = '';

    cols.forEach(function (c, ci) {
      var x = PAD + labW + gap / 2 + ci * (cw + gap);
      var t = tone(c.tone);
      out += rect(x, PAD, cw, headH + rowH.reduce(function (a, b) { return a + b; }, 0), {
        r: 8, fill: c.tone ? t.fill : 'var(--sunk)', stroke: c.tone ? t.stroke : 'var(--line)',
      });
      var hl = wrap(c.title, cw - 18, 12);
      out += block(x + 10, PAD + (hl.length > 1 ? 17 : 25), cw, hl, { size: 12, weight: 700, fill: t.ink });
    });

    var y = PAD + headH;
    rowsN.forEach(function (r, ri) {
      out += txt(PAD, y + 18, r.label, { size: 11.5, weight: 600, fill: 'var(--ink-2)' });
      if (ri) out += '<line x1="' + (PAD + labW) + '" y1="' + y + '" x2="' + (W - PAD) + '" y2="' + y + '" stroke="var(--line)"/>';
      cols.forEach(function (c, ci) {
        var x = PAD + labW + gap / 2 + ci * (cw + gap);
        var cell = (r.cells || [])[ci];
        out += block(x + 10, y + 18, cw, wrap(cell || '—', cw - 20, 11.5), {
          size: 11.5, fill: cell ? (c.tone ? tone(c.tone).ink : 'var(--ink)') : 'var(--ink-4)',
        });
      });
      y += rowH[ri];
    });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── ba — before and after ───────────────────────────────────────────────
     Two panels, the change between them named in the middle. */
  function ba(v) {
    var gap = 54;
    var cw = (W - PAD * 2 - gap) / 2;
    var sides = [v.before || {}, v.after || {}];
    var maxLines = Math.max(
      (sides[0].lines || []).length, (sides[1].lines || []).length
    );
    var bh = 42 + maxLines * 24 + 14;
    var h = PAD + bh + PAD + (v.note ? 24 : 0);
    var out = '';
    sides.forEach(function (s, i) {
      var x = PAD + i * (cw + gap);
      var t = tone(s.tone || (i ? 'accent' : 'sunk'));
      out += rect(x, PAD, cw, bh, { r: 8, fill: t.fill, stroke: t.stroke });
      out += txt(x + 13, PAD + 21, (s.title || (i ? 'After' : 'Before')).toUpperCase(), {
        size: 9.5, ls: '.09em', fill: t.ink, weight: 700, mono: true,
      });
      (s.lines || []).forEach(function (l, li) {
        var ly = PAD + 42 + li * 24;
        out += '<circle cx="' + (x + 18) + '" cy="' + (ly + 6) + '" r="2.6" fill="' + (l.mark ? t.stroke : 'var(--ink-4)') + '"/>';
        out += txt(x + 28, ly + 10, typeof l === 'string' ? l : l.t, {
          size: 11.5, fill: (l.mark ? t.ink : 'var(--ink-2)'), weight: l.mark ? 600 : 400,
        });
      });
    });
    var mx = PAD + cw + gap / 2;
    out += '<line x1="' + (PAD + cw + 8) + '" y1="' + (PAD + bh / 2) + '" x2="' + (PAD + cw + gap - 10) + '" y2="' + (PAD + bh / 2) +
      '" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#dgar-a)"/>';
    if (v.via) out += txt(mx, PAD + bh / 2 - 12, v.via, { size: 10, anchor: 'middle', fill: 'var(--accent)', mono: true });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── arch — layers ───────────────────────────────────────────────────────
     Bottom-up, because that is how the thing is built: file at the bottom,
     the surface the user touches at the top. */
  function arch(v) {
    var ls = (v.layers || []).slice().reverse();
    var lh = 56, gap = 9;
    var h = PAD + ls.length * (lh + gap) - gap + PAD + (v.note ? 24 : 0);
    var out = '';
    ls.forEach(function (l, i) {
      var y = PAD + i * (lh + gap);
      var t = tone(l.tone);
      out += rect(PAD, y, W - PAD * 2, lh, { r: 7, fill: t.fill, stroke: t.stroke });
      out += txt(PAD + 14, y + 23, l.label, { size: 12.5, weight: 700, fill: t.ink });
      if (l.items && l.items.length) {
        out += txt(PAD + 14, y + 41, l.items.join('  ·  '), { size: 11, fill: 'var(--ink-3)', mono: true });
      }
      if (l.side) out += txt(W - PAD - 14, y + 23, l.side, { size: 10.5, anchor: 'end', fill: 'var(--ink-4)', mono: true });
    });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── timeline ────────────────────────────────────────────────────────────
     Dated events. Used for the graveyard questions, where when a thing died is
     the whole argument. */
  function timeline(v) {
    var it = v.items || [];
    var rowH = 46;
    var h = PAD + it.length * rowH + PAD + (v.note ? 22 : 0);
    var lx = PAD + 96;
    var out = '<line x1="' + lx + '" y1="' + (PAD + 8) + '" x2="' + lx + '" y2="' + (PAD + it.length * rowH - 18) + '" stroke="var(--line-2)" stroke-width="1.5"/>';
    it.forEach(function (e, i) {
      var y = PAD + i * rowH + 14;
      var t = tone(e.tone);
      out += txt(lx - 16, y + 4, e.when, { size: 11, anchor: 'end', fill: 'var(--ink-3)', mono: true, weight: 600 });
      out += '<circle cx="' + lx + '" cy="' + y + '" r="5" fill="' + (e.tone ? t.stroke : 'var(--ink-4)') + '" stroke="var(--card)" stroke-width="2"/>';
      out += txt(lx + 16, y + 4, e.label, { size: 12.5, weight: 600, fill: e.tone ? t.ink : 'var(--ink)' });
      if (e.note) out += txt(lx + 16, y + 21, e.note, { size: 11, fill: 'var(--ink-3)' });
    });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── matrix — a 2x2 with the field on it ─────────────────────────────────
     x and y are 0..1. `us` marks where frontmatter would sit. */
  function matrix(v) {
    var size = 300, ox = PAD + 108, oy = PAD + 14;
    var h = oy + size + 46 + (v.note ? 20 : 0);
    var out = '';
    out += rect(ox, oy, size, size, { r: 8, fill: 'var(--sunk)', stroke: 'var(--line)' });
    out += '<line x1="' + (ox + size / 2) + '" y1="' + oy + '" x2="' + (ox + size / 2) + '" y2="' + (oy + size) + '" stroke="var(--line-2)" stroke-dasharray="3 3"/>';
    out += '<line x1="' + ox + '" y1="' + (oy + size / 2) + '" x2="' + (ox + size) + '" y2="' + (oy + size / 2) + '" stroke="var(--line-2)" stroke-dasharray="3 3"/>';
    out += txt(ox + size / 2, oy + size + 22, (v.x || [])[1] || '', { size: 11, anchor: 'middle', fill: 'var(--ink-3)' });
    out += txt(ox + size / 2, oy - 4, (v.y || [])[1] || '', { size: 11, anchor: 'middle', fill: 'var(--ink-3)' });
    out += txt(ox - 10, oy + size / 2, (v.y || [])[0] || '', { size: 11, anchor: 'end', fill: 'var(--ink-3)' });
    out += txt(ox - 10, oy + size / 2 + 15, (v.x || [])[0] || '', { size: 11, anchor: 'end', fill: 'var(--ink-4)' });

    (v.points || []).forEach(function (p) {
      var px = ox + p.x * size, py = oy + (1 - p.y) * size;
      var t = tone(p.us ? 'accent' : 'neutral');
      out += '<circle cx="' + px + '" cy="' + py + '" r="' + (p.us ? 7 : 4.5) + '" fill="' + (p.us ? t.stroke : 'var(--ink-4)') + '"' +
        (p.us ? ' stroke="var(--card)" stroke-width="2"' : '') + '/>';
      out += txt(px + (p.x > 0.72 ? -10 : 11), py + 4, p.label, {
        size: 11, fill: p.us ? t.ink : 'var(--ink-2)', weight: p.us ? 700 : 400,
        anchor: p.x > 0.72 ? 'end' : 'start',
      });
    });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── file — a markdown file with byte ranges marked ──────────────────────
     The product's whole argument is about bytes, so several decisions are
     clearest as the file itself with a span highlighted. */
  function file(v) {
    var lines = v.lines || [];
    var lh = 21;
    var bh = 34 + lines.length * lh + 12;
    var h = PAD + bh + PAD + (v.note ? 22 : 0);
    var out = rect(PAD, PAD, W - PAD * 2, bh, { r: 8, fill: 'var(--sunk)', stroke: 'var(--line-2)' });
    out += txt(PAD + 14, PAD + 21, v.name || 'README.md', { size: 11, fill: 'var(--ink-3)', mono: true, weight: 600 });
    out += '<line x1="' + PAD + '" y1="' + (PAD + 30) + '" x2="' + (W - PAD) + '" y2="' + (PAD + 30) + '" stroke="var(--line)"/>';
    lines.forEach(function (l, i) {
      var y = PAD + 34 + i * lh;
      var s = typeof l === 'string' ? { t: l } : l;
      if (s.mark) {
        var t = tone(s.mark === true ? 'accent' : s.mark);
        out += rect(PAD + 40, y, W - PAD * 2 - 54, lh - 3, { r: 3, fill: t.fill, stroke: t.stroke, sw: 1 });
      }
      out += txt(PAD + 30, y + 14, String(i + 1), { size: 10, anchor: 'end', fill: 'var(--ink-4)', mono: true });
      out += txt(PAD + 48, y + 14, s.t, {
        size: 11.5, mono: true,
        fill: s.mark ? tone(s.mark === true ? 'accent' : s.mark).ink : 'var(--ink-2)',
      });
      if (s.note) out += txt(W - PAD - 14, y + 14, s.note, { size: 10, anchor: 'end', fill: 'var(--ink-4)', mono: true });
    });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  /* ── funnel ──────────────────────────────────────────────────────────────
     Counts narrowing. Width is proportional to the number, so a collapse from
     266 to 0 looks like a collapse instead of reading like a list. */
  function funnel(v) {
    var st = v.steps || [];
    var max = Math.max.apply(null, st.map(function (s) { return Math.abs(s.n) || 0; }).concat([1]));
    var rowH = 44;
    var h = PAD + st.length * rowH + PAD + (v.note ? 22 : 0);
    var labW = 250;
    var out = '';
    st.forEach(function (s, i) {
      var y = PAD + i * rowH;
      var bw = Math.max(3, (Math.abs(s.n) / max) * (W - PAD * 2 - labW - 70));
      var t = tone(s.tone || (i === st.length - 1 ? 'stop' : 'sunk'));
      out += block(PAD, y + 17, labW, wrap(s.label, labW - 8, 11.5), { size: 11.5, fill: 'var(--ink-2)' });
      out += rect(PAD + labW, y + 6, bw, 24, { r: 4, fill: t.fill, stroke: t.stroke });
      out += txt(PAD + labW + bw + 10, y + 22, s.n + (s.unit ? ' ' + s.unit : ''), {
        size: 12.5, weight: 700, fill: t.ink === 'var(--ink)' ? 'var(--ink)' : t.ink, mono: true,
      });
    });
    if (v.note) out += txt(PAD, h - 6, v.note, { size: 11.5, fill: 'var(--ink-3)' });
    return svg(h, out, v.caption);
  }

  var KINDS = {
    screen: screen, flow: flow, state: state, compare: compare,
    ba: ba, arch: arch, timeline: timeline, matrix: matrix, file: file, funnel: funnel,
  };

  function render(v) {
    if (!v || !v.kind) return '';
    var fn = KINDS[v.kind];
    if (!fn) return '';
    try { return fn(v); } catch (e) { return ''; }
  }

  root.Diagram = { render: render, kinds: Object.keys(KINDS) };
}(typeof window !== 'undefined' ? window : this));
