window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
  if (arguments[0] === 'event') {
    // Only the current landing-page view is retained while marketing loads.
    // Clicks before advertising consent are never replayed.
    if (arguments[1] === 'view_breakfast_offer') window.WaxBrewOfferView = arguments[2];
    // Advertising failures must not interrupt analytics or the user's action.
    try {
      if (window.WaxBrewMarketing) window.WaxBrewMarketing.track(arguments[1], arguments[2]);
    } catch (_) {}
  }
}
(function () {
  var preference = null;
  try {
    var saved = JSON.parse(localStorage.getItem('waxbrew_ad_consent_v1'));
    if (saved && typeof saved.granted === 'boolean' && saved.expires > Date.now()) preference = saved.granted;
  } catch (_) {}
  var demo = new URLSearchParams(location.search).get('preview') === '1';
  window.WaxBrewAdConsent = { preference:preference, granted:preference === true && !demo, demo:demo };
  var state = window.WaxBrewAdConsent.granted ? 'granted' : 'denied';
  gtag('consent', 'default', {ad_storage:state, ad_user_data:state, ad_personalization:state});
})();
gtag('js', new Date());
gtag('config', 'G-PMMNXCF8LX', { page_path: location.pathname, page_title: document.title });

(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-PMMNXCF8LX';
  document.head.appendChild(s);
  var marketing = document.createElement('script');
  marketing.async = true;
  marketing.src = '/assets/marketing.js';
  document.head.appendChild(marketing);
})();
