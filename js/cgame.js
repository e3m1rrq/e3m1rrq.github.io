/* game.js - oyun kuralları (arayüzden bağımsız) */
(function (F) {
  F.YIELD = 2; F.FERT_COST = 8; F.MAXP = 12; F.state = null;
  F.toast = F.toast || function () {};
  F.crop = function (id) { return F.CROPS.filter(function (c) { return c.id === id; })[0]; };
  F.need = function (l) { return 60 * l; };
  F.plotCost = function (n) { return 150 * (n - 3); };
  F.plotLvl = function (n) { return n - 2; };
  F.save = function () { F.store.save(F.state); };

  F.newState = function (profile) {
    return {
      v: 1, profile: profile, money: 500, xp: 0, level: 1,
      plots: [null, null, null, null], seeds: { wheat: 3 }, inv: {},
      stats: { harvest: 0, earned: 0, created: Date.now() },
      mk: { t: Date.now(), f: {} }
    };
  };

  F.info = function (p) {
    if (!p) return { st: 'empty', pr: 0, left: 0 };
    var c = F.crop(p.crop), d = c.time * 1000 * (p.water ? 0.75 : 1), e = Date.now() - p.t0;
    var pr = Math.max(0, Math.min(1, e / d));
    return { st: pr >= 1 ? 'ready' : 'grow', pr: pr, left: Math.max(0, Math.ceil((d - e) / 1000)), c: c };
  };

  F.price = function (id) { return Math.round(F.crop(id).sell * (F.state.mk.f[id] || 1)); };

  F.addXp = function (n) {
    var s = F.state; s.xp += n;
    while (s.xp >= F.need(s.level)) {
      s.xp -= F.need(s.level); s.level++;
      var b = 50 * s.level; s.money += b;
      F.toast('Seviye ' + s.level + '! +' + b + ' bonus');
    }
  };

  F.plant = function (i, id) {
    var s = F.state, c = F.crop(id);
    if (s.plots[i] || s.level < c.lvl) return false;
    if (!(s.seeds[id] > 0)) {
      if (s.money < c.cost) { F.toast('Yetersiz para'); return false; }
      s.money -= c.cost;
    } else s.seeds[id]--;
    s.plots[i] = { crop: id, t0: Date.now(), water: false, fert: false };
    F.save(); return true;
  };

  F.water = function (i) {
    var p = F.state.plots[i];
    if (!p || p.water) return false;
    p.water = true; F.save(); return true;
  };

  F.fert = function (i) {
    var s = F.state, p = s.plots[i];
    if (!p || p.fert) return false;
    if (s.money < F.FERT_COST) { F.toast('Yetersiz para'); return false; }
    s.money -= F.FERT_COST; p.fert = true; F.save(); return true;
  };

  F.harvest = function (i) {
    var s = F.state, p = s.plots[i];
    if (!p || F.info(p).st !== 'ready') return 0;
    var c = F.crop(p.crop), n = F.YIELD + (p.fert ? 1 : 0);
    s.inv[p.crop] = (s.inv[p.crop] || 0) + n;
    s.plots[i] = null; s.stats.harvest += n;
    F.addXp(c.xp * n); F.save(); return n;
  };

  F.harvestAll = function () {
    var t = 0;
    for (var i = 0; i < F.state.plots.length; i++) t += F.harvest(i);
    return t;
  };

  F.buySeed = function (id, n) {
    var s = F.state, c = F.crop(id);
    if (s.level < c.lvl) return false;
    if (s.money < c.cost * n) { F.toast('Yetersiz para'); return false; }
    s.money -= c.cost * n; s.seeds[id] = (s.seeds[id] || 0) + n; F.save(); return true;
  };

  F.sell = function (id, n) {
    var s = F.state, have = s.inv[id] || 0;
    if (n === 'all') n = have;
    n = Math.min(n, have);
    if (n <= 0) return 0;
    var g = F.price(id) * n;
    s.inv[id] = have - n; s.money += g; s.stats.earned += g;
    F.save(); return g;
  };

  F.sellAll = function () {
    var g = 0;
    F.CROPS.forEach(function (c) { g += F.sell(c.id, 'all'); });
    return g;
  };

  F.buyPlot = function () {
    var s = F.state, n = s.plots.length;
    if (n >= F.MAXP) return false;
    if (s.level < F.plotLvl(n)) { F.toast('Seviye ' + F.plotLvl(n) + ' gerekli'); return false; }
    if (s.money < F.plotCost(n)) { F.toast('Yetersiz para'); return false; }
    s.money -= F.plotCost(n); s.plots.push(null); F.save(); return true;
  };

  F.tickMarket = function () {
    var m = F.state.mk, steps = Math.min(20, Math.floor((Date.now() - m.t) / 60000));
    for (var k = 0; k < steps; k++) {
      F.CROPS.forEach(function (c) {
        var f = (m.f[c.id] || 1) * (1 + (Math.random() - 0.5) * 0.2);
        m.f[c.id] = Math.min(1.3, Math.max(0.75, f));
      });
    }
    if (steps > 0) m.t = Date.now();
    return steps > 0;
  };
})(window.FC);
