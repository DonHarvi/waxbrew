(function () {
  'use strict';
  if (window.WaxBrewMarketing) return;
  var PIXEL_ID = '2044160039594691';
  var KEY = 'waxbrew_ad_consent_v1';
  var consent = window.WaxBrewAdConsent || {preference:null, granted:false, demo:false};
  var initialized = false;
  var sent = new Set();
  var panel, settings;
  var strings = {
    ru: {title:'Разрешить рекламные cookies?', text:'Meta и Google используют cookies для персональной рекламы WaxBrew и оценки её эффективности. Выбор можно изменить внизу страницы.', yes:'Разрешить', no:'Без рекламных cookies', settings:'Рекламные cookies'},
    en: {title:'Allow advertising cookies?', text:'Meta and Google use cookies to personalise WaxBrew ads and measure their performance. You can change your choice at the bottom of the page.', yes:'Allow', no:'No advertising cookies', settings:'Advertising cookies'},
    sr: {title:'Dozvoliti reklamne kolačiće?', text:'Meta i Google koriste kolačiće za personalizovane WaxBrew oglase i mjerenje njihove uspješnosti. Izbor možete promijeniti na dnu stranice.', yes:'Dozvoli', no:'Bez reklamnih kolačića', settings:'Reklamni kolačići'}
  };
  function language() { return (document.documentElement.lang || 'en').split('-')[0]; }
  function words() { return strings[language()] || strings.en; }
  function startPixel() {
    if (!consent.granted || consent.demo) return;
    if (!initialized) {
      // Standard Meta bootstrap. No script or pixel request before consent.
      if (!window.fbq) {
        var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!window._fbq) window._fbq = n;
        n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);
      }
      window.fbq('consent', 'grant');
      window.fbq('set', 'autoConfig', false, PIXEL_ID);
      window.fbq('init', PIXEL_ID);
      initialized = true;
    } else window.fbq('consent', 'grant');
    if (!sent.has('PageView')) {
      sent.add('PageView');
      window.fbq('track', 'PageView');
    }
    if (window.WaxBrewOfferView) track('view_breakfast_offer', window.WaxBrewOfferView);
  }
  function track(name, details) {
    if (!consent.granted || consent.demo || !initialized) return;
    var event = {view_breakfast_offer:'BloggerVisit', view_breakfast_coupon:'BreakfastCouponOpen'}[name];
    if (!event || !details || details.campaign_name !== 'blogeri' || details.blogger_id === 'unattributed' || !/^[a-z0-9_.-]{1,64}$/.test(details.blogger_id || '')) return;
    var key = event + ':' + details.blogger_id;
    if (sent.has(key)) return;
    var params = {campaign:'blogeri', blogger_id:details.blogger_id, language:details.language, location_name:'tre_canne'};
    if (event === 'BreakfastCouponOpen') {
      if (!/^WAXBREW-[A-Z0-9-]{1,32}$/.test(details.coupon_code || '')) return;
      params.coupon_code = details.coupon_code;
    }
    sent.add(key);
    window.fbq('trackCustom', event, params);
  }
  function removeMetaCookies() {
    ['_fbp','_fbc'].forEach(function(name) {
      ['', '; domain=' + location.hostname, '; domain=.waxbrew.com'].forEach(function(domain) {
        document.cookie = name + '=; max-age=0; path=/' + domain + '; SameSite=Lax';
      });
    });
  }
  function apply(granted, persist) {
    consent.preference = granted;
    consent.granted = granted && !consent.demo;
    if (persist) {
      try { localStorage.setItem(KEY, JSON.stringify({granted:granted, expires:Date.now() + 180 * 86400000})); } catch (_) {}
    }
    var value = consent.granted ? 'granted' : 'denied';
    window.gtag('consent', 'update', {ad_storage:value, ad_user_data:value, ad_personalization:value});
    if (consent.granted) startPixel();
    else {
      if (window.fbq) window.fbq('consent', 'revoke');
      removeMetaCookies();
    }
    if (panel) panel.hidden = true;
  }
  function renderLanguage() {
    if (!panel) return;
    var text = words();
    panel.querySelector('h2').textContent = text.title;
    panel.querySelector('p').textContent = text.text;
    panel.querySelector('[data-ad-allow]').textContent = text.yes;
    panel.querySelector('[data-ad-deny]').textContent = text.no;
    settings.textContent = text.settings;
  }
  function openSettings() {
    if (!panel) return;
    panel.hidden = false;
    panel.querySelector('[data-ad-deny]').focus();
  }
  function createUI() {
    if (consent.demo) return;
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = '/assets/marketing.css';
    panel = document.createElement('aside');
    panel.className = 'wax-ad-consent';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'wax-ad-consent-title');
    panel.setAttribute('aria-describedby', 'wax-ad-consent-text');
    panel.hidden = consent.preference !== null;
    panel.innerHTML = '<h2 id="wax-ad-consent-title"></h2><p id="wax-ad-consent-text"></p><div class="wax-ad-consent-actions"><button type="button" data-ad-deny></button><button type="button" data-ad-allow></button></div>';
    // Hide until the consent stylesheet is ready, to avoid an unstyled flash.
    panel.style.visibility = 'hidden';
    css.addEventListener('load', function() { panel.style.visibility = ''; });
    css.addEventListener('error', function() { panel.style.visibility = ''; });
    document.head.appendChild(css);
    panel.addEventListener('click', function(event) {
      if (event.target.closest('[data-ad-allow]')) apply(true, true);
      if (event.target.closest('[data-ad-deny]')) apply(false, true);
    });
    document.body.appendChild(panel);
    settings = document.createElement('button');
    settings.className = 'wax-ad-settings'; settings.type = 'button';
    settings.addEventListener('click', openSettings);
    var footer = document.querySelector('footer');
    if (footer) footer.appendChild(settings);
    else { var holder = document.createElement('div'); holder.className = 'wax-ad-settings-wrap'; holder.appendChild(settings); document.body.appendChild(holder); }
    renderLanguage();
    new MutationObserver(renderLanguage).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  }
  window.WaxBrewMarketing = {track:track, openSettings:openSettings};
  startPixel();
  window.addEventListener('storage', function(event) {
    if (event.key !== KEY && event.key !== null) return;
    var saved;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (_) {}
    apply(!!(saved && saved.granted === true && saved.expires > Date.now()), false);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createUI);
  else createUI();
})();
