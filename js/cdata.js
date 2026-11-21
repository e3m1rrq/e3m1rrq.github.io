/* data.js - ekin verileri ve SVG ikonlar */
window.FC = {};
(function (F) {
  F.CROPS = [
    { id: 'wheat',     name: 'Buğday',    cost: 10,  time: 60,  sell: 14,  xp: 5,  lvl: 1 },
    { id: 'corn',      name: 'Mısır',     cost: 25,  time: 120, sell: 34,  xp: 9,  lvl: 2 },
    { id: 'sunflower', name: 'Ayçiçeği',  cost: 40,  time: 180, sell: 58,  xp: 14, lvl: 3 },
    { id: 'potato',    name: 'Patates',   cost: 60,  time: 240, sell: 85,  xp: 20, lvl: 4 },
    { id: 'tomato',    name: 'Domates',   cost: 90,  time: 300, sell: 125, xp: 28, lvl: 5 },
    { id: 'cotton',    name: 'Pamuk',     cost: 140, time: 420, sell: 190, xp: 40, lvl: 6 }
  ];

  var stem = '<path d="M32 60V26" stroke="#4f8a2b" stroke-width="3.5" stroke-linecap="round"/>';
  var CI = {
    wheat: stem + [6, 18, 30].map(function (y) {
      return '<ellipse cx="25" cy="' + (y + 8) + '" rx="5" ry="9" fill="#f0c94a" transform="rotate(-28 25 ' + (y + 8) + ')"/>' +
             '<ellipse cx="39" cy="' + (y + 8) + '" rx="5" ry="9" fill="#d9a92e" transform="rotate(28 39 ' + (y + 8) + ')"/>';
    }).join('') + '<ellipse cx="32" cy="10" rx="4.5" ry="9" fill="#f0c94a"/>',
    corn: '<ellipse cx="32" cy="30" rx="10" ry="20" fill="#f6c93a"/>' +
      [22, 30, 38].map(function (y) { return '<path d="M26 ' + y + 'h12" stroke="#d99b1c" stroke-width="1.5"/>'; }).join('') +
      '<path d="M32 58L14 30Q28 36 32 58Z M32 58L50 30Q36 36 32 58Z" fill="#5fa83f"/>',
    sunflower: stem + [0, 45, 90, 135].map(function (a) {
      return '<ellipse cx="32" cy="24" rx="5" ry="15" fill="#fbc02d" transform="rotate(' + a + ' 32 24)"/>';
    }).join('') + '<circle cx="32" cy="24" r="8.5" fill="#6d3b1a"/><circle cx="32" cy="24" r="4" fill="#8d5524"/>',
    potato: '<path d="M32 30L18 14M32 30L32 8M32 30L46 14" stroke="#4f8a2b" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="25" cy="44" rx="14" ry="11" fill="#b9814a" transform="rotate(-15 25 44)"/>' +
      '<ellipse cx="42" cy="40" rx="10" ry="8" fill="#c99560" transform="rotate(20 42 40)"/>' +
      '<circle cx="21" cy="42" r="1.6" fill="#7a5028"/><circle cx="30" cy="48" r="1.6" fill="#7a5028"/><circle cx="43" cy="39" r="1.4" fill="#7a5028"/>',
    tomato: '<circle cx="32" cy="38" r="20" fill="#e53935"/><ellipse cx="25" cy="30" rx="5" ry="3" fill="#ff8a80" transform="rotate(-30 25 30)"/>' +
      '<path d="M32 20L24 14L30 24L20 24L29 28L32 20L35 28L44 24L34 24L40 14Z" fill="#4f8a2b"/>',
    cotton: '<path d="M32 62V36" stroke="#7a5028" stroke-width="3.5" stroke-linecap="round"/>' +
      '<circle cx="22" cy="28" r="10" fill="#fff"/><circle cx="42" cy="28" r="10" fill="#f4f4f4"/><circle cx="32" cy="17" r="10" fill="#fff"/><circle cx="32" cy="30" r="9" fill="#ececec"/>' +
      '<path d="M18 40Q32 30 46 40L32 44Z" fill="#6f8f3a"/>'
  };
  F.icon = function (id, s) {
    return '<svg viewBox="0 0 64 64" width="' + s + '" height="' + s + '">' + (CI[id] || '') + '</svg>';
  };

  var UI = {
    coin: '<circle cx="12" cy="12" r="10" fill="#f5b82e" stroke="#c98a0b" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#c98a0b" stroke-width="1.6"/>',
    drop: '<path d="M12 2C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-13Z" fill="#3aa0e8"/>',
    bag: '<path d="M7 5h10l2 4v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Z" fill="#9c6b3a"/><path d="M8 5l4 3 4-3" fill="none" stroke="#5b3a1a" stroke-width="1.6"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2" fill="#777"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#777" stroke-width="2.4"/>',
    plus: '<path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    farm: '<path d="M3 21V10l9-6 9 6v11h-6v-7H9v7Z" fill="currentColor"/>',
    box: '<path d="M3 8l9-5 9 5v9l-9 5-9-5Z" fill="currentColor"/><path d="M3 8l9 5 9-5M12 13v9" stroke="#fff" stroke-width="1.5" fill="none"/>',
    shop: '<path d="M3 9l2-5h14l2 5Z" fill="currentColor"/><path d="M5 10v10h14V10" fill="none" stroke="currentColor" stroke-width="2.4"/>',
    user: '<circle cx="12" cy="8" r="5" fill="currentColor"/><path d="M3 22c0-5 4-8 9-8s9 3 9 8Z" fill="currentColor"/>',
    logo: '<circle cx="19" cy="6" r="3.6" fill="#ffd54a"/><path d="M2 21V11l8-5.5 8 5.5v10Z" fill="#c0392b"/><path d="M7 21v-6h6v6Z" fill="#fff4dc"/><path d="M2 11l8-5.5 8 5.5" fill="none" stroke="#7a1f14" stroke-width="1.2"/>'
  };
  F.ico = function (n, s) {
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" class="ic">' + (UI[n] || '') + '</svg>';
  };

  var SK = ['#f5cfa0', '#e0a878', '#c68642', '#8d5524'];
  var HAT = ['#c0392b', '#2e86c1', '#f1c40f', '#27ae60', '#8e44ad', '#e67e22', '#16a085', '#6d4c41'];
  var SH = ['#2e86c1', '#c0392b', '#27ae60', '#f39c12', '#16a085', '#8e44ad', '#34495e', '#d35400'];
  F.AVATARS = 8;
  F.avatar = function (i, s) {
    return '<svg viewBox="0 0 64 64" width="' + s + '" height="' + s + '"><rect width="64" height="64" rx="14" fill="#dff0c8"/>' +
      '<path d="M12 64Q14 44 32 44Q50 44 52 64Z" fill="' + SH[i % 8] + '"/>' +
      '<circle cx="32" cy="30" r="12" fill="' + SK[i % 4] + '"/>' +
      '<circle cx="27.5" cy="29" r="1.7" fill="#333"/><circle cx="36.5" cy="29" r="1.7" fill="#333"/>' +
      '<path d="M27 35Q32 39 37 35" stroke="#7a3b1e" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="32" cy="22" rx="19" ry="4.5" fill="' + HAT[i % 8] + '"/>' +
      '<path d="M21 22Q21 8 32 8Q43 8 43 22Z" fill="' + HAT[i % 8] + '"/></svg>';
  };
})(window.FC);
