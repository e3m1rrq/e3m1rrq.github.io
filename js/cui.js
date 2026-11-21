/* ui.js - ekranlar, paneller ve tıklama işlemleri */
(function (F) {
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return Math.round(n).toLocaleString('tr-TR'); };
  var tm = function (s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };
  var screen = 'menu', tab = 'farm', mt = 'sell', sh = null, shKey = '';
  var draft = { name: '', farm: '', av: 0, theme: 'spring' };

  F.toast = function (m) {
    var t = $('#toast'); t.textContent = m; t.className = 'show';
    clearTimeout(F._tt); F._tt = setTimeout(function () { t.className = ''; }, 1900);
  };

  function menu() {
    screen = 'menu'; document.body.className = 'theme-spring';
    var has = !!F.store.load();
    $('#app').innerHTML = '<div class="menu"><div class="logo">' + F.ico('logo', 110) + '</div>' +
      '<h1>Çiftlik<br>İmparatorluğu</h1><p>Küçük bir tarladan büyük bir imparatorluğa.</p>' +
      (has ? '<button class="btn big" data-act="cont">Devam Et</button>' : '') +
      '<button class="btn big ' + (has ? 'alt' : '') + '" data-act="new">Yeni Oyun</button></div>';
  }

  function create() {
    screen = 'create'; document.body.className = 'theme-' + draft.theme;
    var av = '', i;
    for (i = 0; i < F.AVATARS; i++) av += '<button class="av ' + (draft.av === i ? 'sel' : '') + '" data-act="av" data-i="' + i + '">' + F.avatar(i, 58) + '</button>';
    var th = [['spring', 'Bahar'], ['summer', 'Yaz'], ['autumn', 'Sonbahar']].map(function (t) {
      return '<button class="chip ' + (draft.theme === t[0] ? 'sel' : '') + '" data-act="theme" data-t="' + t[0] + '">' + t[1] + '</button>';
    }).join('');
    $('#app').innerHTML = '<div class="create"><h2>Profilini oluştur</h2>' +
      '<label>Kullanıcı adı</label><input id="in-name" maxlength="16" placeholder="3-16 karakter" value="' + esc(draft.name) + '">' +
      '<label>Avatar</label><div class="avs">' + av + '</div>' +
      '<label>Çiftlik adı</label><input id="in-farm" maxlength="24" placeholder="Örn: Yeşilvadi Çiftliği" value="' + esc(draft.farm) + '">' +
      '<label>Çiftlik teması</label><div class="chips">' + th + '</div>' +
      '<button class="btn big" data-act="start">Oyuna başla</button><button class="btn link" data-act="menu">Geri</button></div>';
  }

  function head() {
    var s = F.state, p = s.profile, pc = Math.floor(100 * s.xp / F.need(s.level));
    return '<header><div class="me">' + F.avatar(p.av, 46) + '<div><b>' + esc(p.name) + '</b><small>' + esc(p.farm) + '</small></div></div>' +
      '<div class="stats"><div class="pill">' + F.ico('coin', 18) + '<b>' + money(s.money) + '</b></div>' +
      '<div class="lv"><span>Sv ' + s.level + '</span><i><u style="width:' + pc + '%"></u></i></div></div></header>';
  }

  function nav() {
    var t = [['farm', 'farm', 'Çiftlik'], ['depot', 'box', 'Depo'], ['market', 'shop', 'Pazar'], ['me', 'user', 'Profil']];
    return '<nav>' + t.map(function (x) {
      return '<button class="' + (tab === x[0] ? 'sel' : '') + '" data-act="tab" data-t="' + x[0] + '">' + F.ico(x[1], 24) + '<span>' + x[2] + '</span></button>';
    }).join('') + '</nav>';
  }

  function plotHTML(p, i) {
    var f = F.info(p);
    if (f.st === 'empty') return '<button class="plot empty" data-act="plot" data-i="' + i + '"><span class="soil"></span><em>Boş tarla</em></button>';
    return '<button class="plot ' + f.st + '" data-act="plot" data-i="' + i + '"><span class="soil"></span>' +
      '<div class="pc" style="transform:scale(' + (0.45 + 0.55 * f.pr).toFixed(2) + ')">' + F.icon(p.crop, 70) + '</div>' +
      '<em>' + (f.st === 'ready' ? 'Hasat zamanı!' : tm(f.left)) + '</em><i class="bar"><u style="width:' + Math.floor(f.pr * 100) + '%"></u></i></button>';
  }

  function gridHTML() {
    var s = F.state, h = s.plots.map(plotHTML).join('');
    if (s.plots.length < F.MAXP) {
      var n = s.plots.length;
      h += '<button class="plot buy" data-act="buyplot"><div>' + F.ico('plus', 34) + '</div><em>Yeni tarla</em><small>' + money(F.plotCost(n)) + ' • Sv ' + F.plotLvl(n) + '</small></button>';
    }
    return h;
  }

  function row(id, mid, right) {
    return '<div class="row">' + F.icon(id, 42) + '<div class="g">' + mid + '</div>' + right + '</div>';
  }

  function depot() {
    var s = F.state, h = '<h3>Ürünler</h3>';
    var a = F.CROPS.filter(function (c) { return s.inv[c.id] > 0; });
    h += a.length ? a.map(function (c) { return row(c.id, '<b>' + c.name + '</b><small>Değer: ' + money(F.price(c.id) * s.inv[c.id]) + '</small>', '<b class="n">' + s.inv[c.id] + '</b>'); }).join('') : '<p class="note">Depo boş. Hasat edince ürünler burada görünür.</p>';
    h += '<h3>Tohumlar</h3>';
    var b = F.CROPS.filter(function (c) { return s.seeds[c.id] > 0; });
    h += b.length ? b.map(function (c) { return row(c.id, '<b>' + c.name + ' tohumu</b>', '<b class="n">' + s.seeds[c.id] + '</b>'); }).join('') : '<p class="note">Tohumun yok. Pazar sekmesinden tohum al.</p>';
    return h;
  }

  function market() {
    var s = F.state;
    var h = '<div class="seg"><button class="' + (mt === 'sell' ? 'sel' : '') + '" data-act="mt" data-m="sell">Sat</button><button class="' + (mt === 'buy' ? 'sel' : '') + '" data-act="mt" data-m="buy">Tohum al</button></div>';
    if (mt === 'sell') {
      var a = F.CROPS.filter(function (c) { return s.inv[c.id] > 0; });
      if (!a.length) return h + '<p class="note">Satacak ürünün yok. Önce hasat yap.</p>';
      h += '<button class="btn sm wide" data-act="sellall">Hepsini sat</button>';
      h += a.map(function (c) {
        var f = s.mk.f[c.id] || 1;
        return row(c.id, '<b>' + c.name + ' (' + s.inv[c.id] + ')</b><small>' + F.price(c.id) + ' / adet <span class="' + (f >= 1 ? 'up' : 'dn') + '">' + (f >= 1 ? '▲' : '▼') + '</span></small>',
          '<button class="btn sm" data-act="sell" data-c="' + c.id + '" data-n="1">1 sat</button><button class="btn sm alt" data-act="sell" data-c="' + c.id + '" data-n="all">Tümü</button>');
      }).join('');
    } else {
      h += F.CROPS.map(function (c) {
        var lock = s.level < c.lvl;
        return '<div class="row ' + (lock ? 'lock' : '') + '">' + F.icon(c.id, 42) + '<div class="g"><b>' + c.name + '</b><small>' + tm(c.time) + ' • ' + c.cost + ' / tohum</small></div>' +
          (lock ? '<span class="tag">' + F.ico('lock', 14) + ' Sv ' + c.lvl + '</span>' : '<button class="btn sm" data-act="buy" data-c="' + c.id + '" data-n="1">1 al</button><button class="btn sm alt" data-act="buy" data-c="' + c.id + '" data-n="5">5 al</button>') + '</div>';
      }).join('');
    }
    return h;
  }

  function me() {
    var s = F.state, p = s.profile, days = Math.max(1, Math.ceil((Date.now() - s.stats.created) / 864e5));
    return '<div class="prof">' + F.avatar(p.av, 96) + '<h2>' + esc(p.name) + '</h2><p>' + esc(p.farm) + '</p></div>' +
      '<div class="kv"><span>Seviye</span><b>' + s.level + '</b></div><div class="kv"><span>Toplam hasat</span><b>' + s.stats.harvest + '</b></div>' +
      '<div class="kv"><span>Satıştan kazanç</span><b>' + money(s.stats.earned) + '</b></div><div class="kv"><span>Tarla sayısı</span><b>' + s.plots.length + '</b></div>' +
      '<div class="kv"><span>Oynama günü</span><b>' + days + '</b></div>' +
      '<button class="btn sm wide" data-act="rename">Çiftlik adını değiştir</button><button class="btn sm wide alt" data-act="menu">Ana menü</button>' +
      '<button class="btn link" data-act="reset">Kaydı sil ve baştan başla</button>';
  }

  function content() {
    if (tab === 'farm') return '<button class="btn sm wide" data-act="hall">Hazır olanları hasat et</button><div id="grid" class="grid">' + gridHTML() + '</div>';
    return { depot: depot, market: market, me: me }[tab]();
  }

  function game() {
    screen = 'game'; document.body.className = 'theme-' + F.state.profile.theme;
    $('#app').innerHTML = head() + '<main>' + content() + '</main>' + nav();
  }

  function drawSheet() {
    var el = $('#sheet');
    if (!sh) { el.className = ''; el.innerHTML = ''; return; }
    var s = F.state, p = s.plots[sh.i], f = F.info(p), b = '';
    shKey = f.st + (p ? '' + p.water + p.fert : '');
    if (f.st === 'empty') {
      b = '<h3>Ne ekmek istersin?</h3>' + F.CROPS.map(function (c) {
        var own = s.seeds[c.id] || 0, lock = s.level < c.lvl;
        return '<div class="row ' + (lock ? 'lock' : '') + '">' + F.icon(c.id, 42) + '<div class="g"><b>' + c.name + '</b><small>' + tm(c.time) + ' • satış ' + c.sell + '</small></div>' +
          (lock ? '<span class="tag">' + F.ico('lock', 14) + ' Sv ' + c.lvl + '</span>' : '<button class="btn sm" data-act="plant" data-c="' + c.id + '">' + (own > 0 ? 'Ek (' + own + ')' : 'Al ve ek • ' + c.cost) + '</button>') + '</div>';
      }).join('');
    } else {
      b = '<h3>' + f.c.name + '</h3><div class="big">' + F.icon(p.crop, 90) + '</div><p class="note">' + (f.st === 'ready' ? 'Hasada hazır!' : 'Kalan süre: ' + tm(f.left)) + '</p>';
      if (f.st === 'ready') b += '<button class="btn big" data-act="harvest">Hasat et (' + (F.YIELD + (p.fert ? 1 : 0)) + ' adet)</button>';
      else b += '<div class="two"><button class="btn" data-act="water" ' + (p.water ? 'disabled' : '') + '>' + F.ico('drop', 18) + (p.water ? ' Sulandı' : ' Sula (ücretsiz)') + '</button>' +
        '<button class="btn alt" data-act="fert" ' + (p.fert ? 'disabled' : '') + '>' + F.ico('bag', 18) + (p.fert ? ' Gübrelendi' : ' Gübrele • ' + F.FERT_COST) + '</button></div>';
    }
    el.className = 'open';
    el.innerHTML = '<div class="back" data-act="close"></div><div class="card">' + b + '<button class="btn link" data-act="close">Kapat</button></div>';
  }

  function closeSheet() { sh = null; drawSheet(); }
  function refresh() { game(); if (sh) drawSheet(); }

  F.tick = function () {
    if (screen !== 'game') return;
    var chg = F.tickMarket();
    if (tab === 'farm' && $('#grid') && !sh) $('#grid').innerHTML = gridHTML();
    else if (tab === 'farm' && $('#grid')) $('#grid').innerHTML = gridHTML();
    if (chg && tab === 'market') { $('main').innerHTML = content(); }
    if (sh) {
      var p = F.state.plots[sh.i], f = F.info(p), k = f.st + (p ? '' + p.water + p.fert : '');
      if (k !== shKey) drawSheet();
    }
  };

  document.addEventListener('input', function (e) {
    if (e.target.id === 'in-name') draft.name = e.target.value;
    if (e.target.id === 'in-farm') draft.farm = e.target.value;
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    var a = b.dataset.act, d = b.dataset, s = F.state, n;
    switch (a) {
      case 'cont': F.state = F.store.load(); if (F.state) { F.tickMarket(); tab = 'farm'; game(); } break;
      case 'new':
        if (F.store.load() && !confirm('Mevcut kayıt silinecek. Emin misin?')) break;
        draft = { name: '', farm: '', av: 0, theme: 'spring' }; create(); break;
      case 'menu': menu(); break;
      case 'av': draft.av = +d.i; create(); break;
      case 'theme': draft.theme = d.t; create(); break;
      case 'start':
        var nm = draft.name.trim(), fm = draft.farm.trim();
        if (nm.length < 3) { F.toast('Kullanıcı adı en az 3 karakter olmalı'); break; }
        if (fm.length < 3) { F.toast('Çiftlik adı en az 3 karakter olmalı'); break; }
        F.state = F.newState({ name: nm, farm: fm, av: draft.av, theme: draft.theme });
        F.save(); tab = 'farm'; game(); F.toast('Hoş geldin, ' + nm + '!'); break;
      case 'tab': tab = d.t; game(); break;
      case 'plot': sh = { i: +d.i }; drawSheet(); break;
      case 'close': closeSheet(); break;
      case 'plant': if (F.plant(sh.i, d.c)) { closeSheet(); game(); } break;
      case 'water': F.water(sh.i); drawSheet(); break;
      case 'fert': if (F.fert(sh.i)) { drawSheet(); game(); } break;
      case 'harvest': n = F.harvest(sh.i); closeSheet(); if (n) F.toast('+' + n + ' ürün hasat edildi'); game(); break;
      case 'hall': n = F.harvestAll(); F.toast(n ? n + ' ürün hasat edildi' : 'Hasada hazır ürün yok'); game(); break;
      case 'buyplot': if (F.buyPlot()) { F.toast('Yeni tarla alındı'); game(); } break;
      case 'mt': mt = d.m; game(); break;
      case 'sell': n = F.sell(d.c, d.n === 'all' ? 'all' : +d.n); if (n) F.toast('+' + money(n) + ' kazandın'); game(); break;
      case 'sellall': n = F.sellAll(); F.toast(n ? '+' + money(n) + ' kazandın' : 'Satacak ürün yok'); game(); break;
      case 'buy': if (F.buySeed(d.c, +d.n)) F.toast(d.n + ' tohum alındı'); game(); break;
      case 'rename':
        var r = prompt('Yeni çiftlik adı (3-24 karakter):', s.profile.farm);
        if (r && r.trim().length >= 3) { s.profile.farm = r.trim().slice(0, 24); F.save(); game(); }
        break;
      case 'reset': if (confirm('Tüm ilerleme silinecek. Emin misin?')) { F.store.clear(); menu(); } break;
    }
  });

  F.menu = menu;
})(window.FC);
