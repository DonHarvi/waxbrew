(async function () {
  'use strict';
  var language = document.documentElement.lang.split('-')[0];
  var lang = ['sr', 'ru', 'en'].includes(language) ? language : 'sr';
  var words = {
    sr: {ready:'Vaš kupon je spreman. Pritisnite „Preuzmi kupon“ i sačuvajte snimak ekrana.', missing:'Otvorite link iz objave vašeg blogera da biste dobili svoj kupon.', pending:'Ponuda se priprema. Detalji poklona biće objavljeni uskoro.', expired:'Ova ponuda je završena.', error:'Kupon trenutno nije dostupan. Pokušajte ponovo kasnije.', demo:'Pregled stranice: ovo je demonstracioni kupon.', desserts:'Deserti u ponudi: ', undecided:'Izbor deserta još nije potvrđen.', creator:'Poklon preko: '},
    ru: {ready:'Купон готов. Нажмите «Забрать купон» и сохраните скриншот.', missing:'Откройте ссылку из публикации вашего блогера, чтобы получить свой купон.', pending:'Предложение готовится. Подробности подарка скоро появятся здесь.', expired:'Эта акция завершена.', error:'Купон сейчас недоступен. Попробуйте позже.', demo:'Предпросмотр страницы: это демонстрационный купон.', desserts:'Десерты на выбор: ', undecided:'Список десертов пока не утверждён.', creator:'Подарок от: '},
    en: {ready:'Your coupon is ready. Tap “Get your coupon” and save a screenshot.', missing:'Open the link in your creator’s post to get your coupon.', pending:'This offer is being prepared. Gift details will be available soon.', expired:'This offer has ended.', error:'The coupon is currently unavailable. Please try again later.', demo:'Page preview: this is a demonstration coupon.', desserts:'Dessert options: ', undecided:'The dessert selection has not yet been confirmed.', creator:'Gift via: '}
  }[lang];
  var query = new URLSearchParams(location.search);
  var demo = query.get('preview') === '1';
  var slug = query.get('utm_content') || '';
  var config, blogger, enabled = false, revealed = false;
  var status = document.querySelector('[data-offer-status]');
  var coupon = document.getElementById('breakfast-coupon');
  var buttons = Array.from(document.querySelectorAll('[data-open-coupon]'));
  function track(name, extra) {
    if (demo || typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({event_category:'breakfast_offer', campaign_name:'blogeri', blogger_id:blogger ? slug : 'unattributed', language:lang, location_name:'tre_canne', page_path:location.pathname}, extra || {}));
  }
  function expired() {
    if (!config) return false;
    var parts = new Intl.DateTimeFormat('en-CA', {timeZone:config.timezone, year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
    var values = {};
    parts.forEach(function(p) { values[p.type] = p.value; });
    return [values.year, values.month, values.day].join('-') > config.valid_until;
  }
  function checkExpiry() {
    if (demo || !expired()) return true;
    enabled = false;
    buttons.forEach(function(b) { b.disabled = true; });
    coupon.hidden = true;
    document.querySelector('[data-coupon-help]').hidden = true;
    document.querySelector('[data-gift-kicker]').textContent = words.expired;
    document.querySelector('.hero-intro p').textContent = words.expired;
    status.textContent = words.expired;
    return false;
  }
  function preserveAttribution() {
    var params = new URLSearchParams();
    if (demo) params.set('preview', '1');
    else if (blogger) {
      params.set('utm_source', 'instagram');
      params.set('utm_medium', 'stories');
      params.set('utm_campaign', 'blogeri');
      params.set('utm_content', slug);
    }
    document.querySelectorAll('.lang-switch a').forEach(function(a) {
      var url = new URL(a.href);
      url.search = params.toString();
      a.href = url.href;
    });
  }
  try {
    var response = await fetch('/assets/breakfast/blogger-campaign.json', {cache:'no-store'});
    if (!response.ok) throw new Error('Campaign unavailable');
    config = await response.json();
    if (config.campaign !== 'blogeri' || config.valid_until !== '2026-12-31' || config.timezone !== 'Europe/Podgorica') throw new Error('Invalid campaign');
    if (query.get('utm_campaign') === 'blogeri' && /^[a-z0-9_.-]{1,64}$/.test(slug) && Object.prototype.hasOwnProperty.call(config.bloggers, slug)) {
      var candidate = config.bloggers[slug];
      if (candidate && candidate.active === true && /^WAXBREW-[A-Z0-9-]{1,32}$/.test(candidate.code) && typeof candidate.name === 'string') blogger = candidate;
    }
    preserveAttribution();
    var dessertsReady = ['sr','ru','en'].every(function(l) { return typeof config.eligible_desserts[l] === 'string' && config.eligible_desserts[l].trim(); });
    if (demo) {
      enabled = true;
      status.textContent = words.demo;
      document.querySelector('[data-demo-label]').hidden = false;
      document.querySelector('[data-coupon-code]').textContent = 'WAXBREW-DEMO';
      document.querySelector('[data-creator-name]').hidden = true;
    } else if (!checkExpiry()) {
      // The expiry message replaces the gift promise and no code is displayed.
    } else if (!blogger) status.textContent = words.missing;
    else if (!dessertsReady) status.textContent = words.pending;
    else {
      enabled = true;
      status.textContent = words.ready;
      document.querySelector('[data-coupon-code]').textContent = blogger.code;
      document.querySelector('[data-creator-name]').textContent = words.creator + blogger.name;
    }
    document.querySelector('[data-eligible-desserts]').textContent = dessertsReady ? words.desserts + config.eligible_desserts[lang] : words.undecided;
    buttons.forEach(function(b) { b.disabled = !enabled; });
    track('view_breakfast_offer', {offer_status:enabled ? 'available' : expired() ? 'expired' : blogger ? 'pending' : 'unattributed'});
  } catch (_) {
    status.textContent = words.error;
  }
  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      if (!enabled || !checkExpiry()) return;
      coupon.hidden = false;
      document.body.classList.add('coupon-in-view');
      document.querySelector('[data-coupon-help]').hidden = false;
      coupon.focus({preventScroll:true});
      coupon.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
      if (!revealed) track('view_breakfast_coupon', {coupon_code:blogger ? blogger.code : ''});
      revealed = true;
    });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      document.body.classList.toggle('coupon-in-view', !coupon.hidden && entries[0].isIntersecting);
    }).observe(coupon);
  }
  document.addEventListener('visibilitychange', function() { if (!document.hidden) checkExpiry(); });
  document.addEventListener('click', function(event) {
    var a = event.target.closest('a');
    if (!a) return;
    if (a.closest('.lang-switch')) track('change_language', {target_language:a.lang});
    else if (a.hasAttribute('data-offer-directions') || a.href.includes('maps.app.goo.gl/')) track('click_directions', {placement:a.closest('.loc') ? 'location' : 'hero'});
    else if (a.classList.contains('inside-link')) track('click_find_inside', {placement:a.closest('.sticky') ? 'sticky' : a.closest('.loc') ? 'location' : 'hero'});
    else if (a.hasAttribute('data-offer-loyalty')) track('click_loyalty', {placement:'breakfast_offer'});
  });
})();
