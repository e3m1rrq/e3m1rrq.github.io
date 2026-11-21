/* main.js - başlatma */
(function (F) {
  F.menu();
  setInterval(F.tick, 1000);
  setInterval(function () { if (F.state) F.save(); }, 10000);
  document.addEventListener('visibilitychange', function () { if (F.state) { F.tickMarket(); F.save(); } });
})(window.FC);
