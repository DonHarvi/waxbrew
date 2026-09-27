(function () {
  function setLang(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var val = el.dataset[lang];
      if (val === undefined) val = el.dataset.en;
      el.innerHTML = val;
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    try { localStorage.setItem('waxbrew-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
  }

  function currentLang() {
    var saved = null;
    try { saved = localStorage.getItem('waxbrew-lang'); } catch (e) {}
    if (saved) return saved;
    var browser = (navigator.language || '').toLowerCase();
    if (browser.startsWith('ru')) return 'ru';
    if (browser.startsWith('sr') || browser.startsWith('hr') || browser.startsWith('bs') || browser.startsWith('cnr') || browser.startsWith('me')) return 'sr';
    return 'en';
  }

  // Re-applies the active language to any markup rendered after page load
  // (e.g. the playlist or Instagram grid, filled in by other scripts).
  function applyCurrent() { setLang(currentLang()); }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.lang-btn');
    if (btn) setLang(btn.dataset.lang);
  });

  document.addEventListener('DOMContentLoaded', applyCurrent);

  window.WaxBrewI18n = { setLang: setLang, applyCurrent: applyCurrent, currentLang: currentLang };
})();
