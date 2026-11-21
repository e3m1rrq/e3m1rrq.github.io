/* storage.js - kayıt katmanı. Supabase'e geçince sadece bu dosya değişecek. */
(function (F) {
  var KEY = 'fc_save_v1';
  F.store = {
    load: function () {
      try {
        var s = JSON.parse(localStorage.getItem(KEY));
        return s && s.profile && s.plots ? s : null;
      } catch (e) { return null; }
    },
    save: function (s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} },
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
})(window.FC);
