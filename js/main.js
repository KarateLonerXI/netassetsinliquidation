// Builds the Wikipedia-style chrome around each page's <main> content,
// and handles the Appearance panel (saved in localStorage).
(function () {
  // ---- ADD NEW MEMOS HERE (newest first). This one list feeds the home page,
  // the memos page and the search box. marks: '*' college pitch, '\u2020' contributor.
  var MEMO_LIST = [
    { date: '8/21/26', title: 'Saker Aviation (OTC:SKAS)', file: 'saker-aviation.html', marks: '' },
    { date: '3/20/26', title: 'Clear Secure (NYSE:YOU)', file: 'clear-secure.html', marks: '*' },
    { date: '11/21/25', title: 'RITM 8.00% 2030 Sr. notes due 7/15/30', file: 'ritm.html', marks: '*\u2020' },
    { date: '11/21/25', title: 'UA 7.25% 2030 Sr. notes due 7/15/30', file: 'under-armour.html', marks: '*\u2020' }
  ];

  var root = document.documentElement;
  var store = {
    get: function (k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var prefs = { text: store.get('text', 'standard'), width: store.get('width', 'standard'), skin: store.get('skin', 'auto') };
  var known = ['fs-small', 'fs-standard', 'fs-large', 'width-standard', 'width-wide', 'skin-auto', 'skin-light', 'skin-dark', 'left-hidden', 'right-hidden'];
  function apply() {
    known.forEach(function (c) { root.classList.remove(c); });
    root.classList.add('fs-' + prefs.text, 'width-' + prefs.width, 'skin-' + prefs.skin);
    if (store.get('left', '') === 'hidden') { root.classList.add('left-hidden'); }
    if (store.get('right', '') === 'hidden') { root.classList.add('right-hidden'); }
  }
  apply(); // before paint

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;
    var base = body.getAttribute('data-root') || '';
    // <ul data-memos> (optionally data-limit="N") is filled from MEMO_LIST.
    document.querySelectorAll('ul[data-memos]').forEach(function (ul) {
      var limit = parseInt(ul.getAttribute('data-limit'), 10) || MEMO_LIST.length;
      ul.innerHTML = MEMO_LIST.slice(0, limit).map(function (m) {
        var marks = '';
        if (m.marks.indexOf('*') > -1) { marks += '<a class="star" href="#college-note" aria-label="See footnote">*</a>'; }
        if (m.marks.indexOf('\u2020') > -1) { marks += '<a class="star dagger" href="#contrib-note" aria-label="See footnote">&dagger;</a>'; }
        return '<li><a href="' + (base ? '' : 'memos/') + m.file + '">' + m.date + '&nbsp; ' + m.title + '</a>' + marks + '</li>';
      }).join('');
    });
    var page = body.getAttribute('data-page') || '';
    var content = document.querySelector('main, article');
    if (!content) { return; }
    var h1 = content.querySelector('h1');
    var title = h1 ? h1.textContent : document.title;

    var nav = [
      ['home', 'Home', 'index.html'],
      ['portfolio', 'Portfolio', 'portfolio.html'],
      ['memos', 'Investment Memos', 'memos/index.html'],
      ['about', 'About Me', 'about.html']
    ];
    var memos = MEMO_LIST.map(function (m) { return [m.date + '\u00a0 ' + m.title, 'memos/' + m.file]; });


    var menu = nav.map(function (n) {
      return '<li' + (n[0] === page ? ' class="active"' : '') + '><a href="' + base + n[2] + '">' + n[1] + '</a></li>';
    }).join('');

    var header = '<header class="vector-header">' +
      '<div class="hdr-left"><button class="menu-btn" aria-label="Main menu" id="menu-btn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M0 5h24M0 12h24M0 19h24" stroke="currentColor" stroke-width="2" fill="none"/></svg></button>' +
      '<a class="wordmark" href="' + base + 'index.html"><span class="name">Net Assets<br>in Liquidation</span></a></div>' +
      '<div class="search"><svg class="search-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12.2 13.6a7 7 0 1 1 1.4-1.4l5.4 5.4-1.4 1.4zM3 8a5 5 0 1 0 10 0A5 5 0 0 0 3 8z"/></svg><input id="search" type="search" placeholder="Search Net Assets in Liquidation" autocomplete="off"><button type="button" class="search-btn" id="search-btn">Search</button><div class="search-results" id="results"></div></div>' +
      '<span class="header-links"><a href="#" class="thanks" id="app-toggle">Thanks for Visiting</a></span></header>';

    var left = '<aside class="sidebar-left"><div class="side-head"><b>Contents</b><button type="button" class="hide-btn" data-hide="left">hide</button></div><ul class="toc-list"><li class="toc-top"><a href="#top">(Top)</a></li>' + menu + '</ul></aside>';
    if (h1) { h1.id = 'top'; }

    var radio = function (name, val, label) {
      return '<label><input type="radio" name="' + name + '" value="' + val + '"' + (prefs[name] === val ? ' checked' : '') + '>' + label + '</label>';
    };
    var right = '<aside class="sidebar-right"><form class="appearance" id="appearance"><div class="side-head"><b>Appearance</b><button type="button" class="hide-btn" data-hide="right">hide</button></div>' +
      '<fieldset><legend>Text</legend>' + radio('text', 'small', 'Small') + radio('text', 'standard', 'Standard') + radio('text', 'large', 'Large') + '</fieldset>' +
      '<fieldset><legend>Width</legend>' + radio('width', 'standard', 'Standard') + radio('width', 'wide', 'Wide') + '</fieldset>' +
      '<fieldset><legend>Color</legend>' + radio('skin', 'auto', 'Automatic') + radio('skin', 'light', 'Light') + radio('skin', 'dark', 'Dark') + '</fieldset></form></aside>';

    var tabs = '<div class="tabs"><span><a class="sel" href="">Article</a></span><span><a class="sel" href="">Read</a><button type="button" class="dots" aria-label="Tools"><svg viewBox="0 0 3 19" width="3" height="19" aria-hidden="true"><rect width="3" height="3" y="0" fill="currentColor"/><rect width="3" height="3" y="8" fill="currentColor"/><rect width="3" height="3" y="16" fill="currentColor"/></svg></button></span></div>';
    var lang = '<div class="lang"><button type="button" class="lang-btn" id="lang-btn"><span class="lang-icon">\u6587<small>A</small></span> 1 language <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button><div class="lang-menu" id="lang-menu" hidden><a href="">English</a></div></div>';
    var sub = '<div class="site-sub">From Net Assets in Liquidation</div>';

    var main = document.createElement('div');
    main.className = 'content';
    main.appendChild(content);

    body.innerHTML = header + '<div class="layout">' + left + '<div id="slot"></div>' + right + '</div>';
    document.getElementById('slot').replaceWith(main);

    var d = new Date(document.lastModified);
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var edited = d.getUTCDate() + ' ' + months[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ', at ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ' (UTC)';
    body.insertAdjacentHTML('beforeend', '<footer class="vector-footer">' +
      '<p>This page was last edited on ' + edited + '.</p>' +
      '<p>By using this site, you agree to the <a href="' + base + 'disclaimer.html">Disclaimers</a> and <a href="' + base + 'privacy.html">Privacy Policy</a>.</p>' +
      '<ul class="footer-links"><li><a href="' + base + 'privacy.html">Privacy policy</a></li><li><a href="' + base + 'disclaimer.html">Disclaimers</a></li></ul></footer>');
    if (h1) {
      var row = document.createElement('div');
      row.className = 'title-row';
      h1.parentNode.insertBefore(row, h1);
      row.appendChild(h1);
      row.insertAdjacentHTML('beforeend', lang);
      row.insertAdjacentHTML('afterend', tabs + sub);
      document.getElementById('lang-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        var m = document.getElementById('lang-menu');
        m.hidden = !m.hidden;
      });
      document.addEventListener('click', function () { document.getElementById('lang-menu').hidden = true; });
    }
    document.title = title;

    document.getElementById('appearance').addEventListener('change', function (e) {
      prefs[e.target.name] = e.target.value;
      store.set(e.target.name, e.target.value);
      apply();
    });
    function toggleSide(side) {
      var cls = side + '-hidden', on = !root.classList.contains(cls);
      root.classList.toggle(cls, on);
      store.set(side, on ? 'hidden' : '');
    }
    document.getElementById('menu-btn').addEventListener('click', function () {
      if (window.innerWidth > 1000) { toggleSide('left'); } else { root.classList.toggle('menu-open'); }
    });
    document.getElementById('app-toggle').addEventListener('click', function (e) { e.preventDefault(); toggleSide('right'); });
    document.querySelectorAll('.hide-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        if (window.innerWidth <= 1000) { root.classList.remove('menu-open'); } else { toggleSide(b.getAttribute('data-hide')); }
      });
    });
    // On phones the Contents list is a drawer: tapping outside it closes it.
    document.addEventListener('click', function (e) {
      if (root.classList.contains('menu-open') && !e.target.closest('.sidebar-left, #menu-btn')) { root.classList.remove('menu-open'); }
    });
    var input = document.getElementById('search'), results = document.getElementById('results');
    var all = nav.map(function (n) { return [n[1], n[2]]; }).concat(memos);
    input.addEventListener('input', function () {
      var q = input.value.toLowerCase();
      var hits = q ? all.filter(function (a) { return a[0].toLowerCase().indexOf(q) > -1; }) : [];
      results.innerHTML = hits.map(function (a) { return '<a href="' + base + a[1] + '">' + a[0] + '</a>'; }).join('');
      results.style.display = hits.length ? 'block' : 'none';
    });
    function go() { var a = results.querySelector('a'); if (a) { location.href = a.href; } }
    document.getElementById('search-btn').addEventListener('click', go);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { go(); } });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) { results.style.display = 'none'; } });

    // Click a column heading in any data table to sort it (click again to reverse).
    document.querySelectorAll('table.data').forEach(function (table) {
      var heads = table.querySelectorAll('thead th');
      var value = function (td) {
        var t = td.textContent.trim();
        if (/^[\u2014\u2013-]*$/.test(t)) { return null; }
        var pct = t.match(/^(-?[\d.,]+)\s*%$/);
        if (pct) { return parseFloat(pct[1].replace(/,/g, '')); }
        var dt = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
        if (dt) { var y = +dt[3]; if (y < 100) { y += 2000; } return new Date(y, dt[1] - 1, dt[2]).getTime(); }
        var num = Number(t.replace(/[$,]/g, ''));
        return t !== '' && !isNaN(num) ? num : t.toLowerCase();
      };
      heads.forEach(function (th, col) {
        th.tabIndex = 0;
        th.setAttribute('role', 'columnheader');
        var sort = function () {
          var dir = th.getAttribute('aria-sort') === 'ascending' ? -1 : 1;
          heads.forEach(function (h) { h.removeAttribute('aria-sort'); });
          th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
          var body = table.tBodies[0];
          Array.prototype.slice.call(body.rows).sort(function (a, b) {
            var x = value(a.cells[col]), y = value(b.cells[col]);
            if (x === null && y === null) { return 0; }
            if (x === null) { return 1; }
            if (y === null) { return -1; }
            return (x < y ? -1 : x > y ? 1 : 0) * dir;
          }).forEach(function (r) { body.appendChild(r); });
        };
        th.addEventListener('click', sort);
        th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); } });
      });
    });
  });
})();
