(function () {
  'use strict';
  var topbar = document.querySelector('.topbar');
  var chipsBar = document.querySelector('.chips');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var sections = chips.map(function (chip) { return document.querySelector(chip.getAttribute('href')); });
  var pending = false;
  var currentId = '';
  var ready = false;
  var query = new URLSearchParams(location.search);
  var allowed = ['en', 'ru', 'sr'];
  var breakfastPaths = {en:'/all-day-breakfast/',ru:'/zavtrak/',sr:'/dorucak/'};
  function language() {
    var lang = document.documentElement.lang;
    return allowed.indexOf(lang) >= 0 ? lang : 'en';
  }
  function track(name, details) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({event_category:'table_menu', location_name:'tre_canne', language:language()}, details));
  }
  function updateLanguage() {
    var lang = language();
    document.title = {en:'WaxBrew Tre Canne — Menu',ru:'WaxBrew Tre Canne — Меню',sr:'WaxBrew Tre Canne — Meni'}[lang];
    chipsBar.setAttribute('aria-label', {en:'Menu categories',ru:'Категории меню',sr:'Kategorije menija'}[lang]);
    document.querySelectorAll('.lang-btn').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.lang === lang)); });
    document.querySelector('[data-menu-link="breakfast"]').href = breakfastPaths[lang];
    document.querySelector('[data-menu-link="directions"]').href = '/tre-canne?lang=' + lang + '#how-to-find';
    updateHeader();
  }
  function updateHeader() {
    document.documentElement.style.setProperty('--header-height', topbar.offsetHeight + 'px');
    onScroll();
  }
  function onScroll() {
    if (pending || !ready) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      var line = topbar.getBoundingClientRect().bottom + 24;
      var active = sections[0];
      sections.forEach(function (section) { if (section.getBoundingClientRect().top <= line) active = section; });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) active = sections[sections.length - 1];
      if (active.id === currentId) return;
      currentId = active.id;
      chips.forEach(function (chip) {
        var selected = chip.getAttribute('href') === '#' + currentId;
        chip.classList.toggle('active', selected);
        if (selected) {
          chip.setAttribute('aria-current','location');
          var box = chip.getBoundingClientRect();
          var parent = chipsBar.getBoundingClientRect();
          if (box.left < parent.left || box.right > parent.right) {
            chipsBar.scrollTo({left:chipsBar.scrollLeft + box.left - parent.left - 16, behavior:'auto'});
          }
        } else chip.removeAttribute('aria-current');
      });
    });
  }
  document.addEventListener('click', function (event) {
    var langButton = event.target.closest('.lang-btn');
    if (langButton) {
      // The shared i18n listener runs first and applies the selected language.
      updateLanguage();
      track('menu_language_change', {target_language:langButton.dataset.lang});
      return;
    }
    var chip = event.target.closest('.chip');
    if (chip) track('menu_category_click', {menu_category:chip.getAttribute('href').slice(1)});
    var link = event.target.closest('[data-menu-link]');
    if (link) track('menu_link_click', {destination:link.dataset.menuLink, transport_type:'beacon'});
  });
  document.addEventListener('DOMContentLoaded', function () {
    var requested = query.get('lang');
    if (window.WaxBrewI18n) window.WaxBrewI18n.setLang(allowed.indexOf(requested) >= 0 ? requested : language());
    ready = true;
    updateLanguage();
    // Only classify our known QR marker; never forward arbitrary query text.
    track('table_menu_open', {entry_source:query.get('from') === 'table' ? 'table_qr' : 'website'});
    if (location.hash && sections.some(function (section) { return '#' + section.id === location.hash; })) {
      document.querySelector(location.hash).scrollIntoView();
    }
  });
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', updateHeader);
  if ('ResizeObserver' in window) new ResizeObserver(updateHeader).observe(topbar);
})();
