(function () {
  'use strict';
  var language = document.documentElement.lang;
  function track(name, details) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      event_category: 'event_catering',
      language: language,
      page_path: location.pathname
    }, details));
  }
  track('view_catering', {});
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[data-event]');
    if (!link || link.hasAttribute('aria-current')) return;
    var details = { placement: link.dataset.placement || 'page' };
    if (link.dataset.method) details.contact_method = link.dataset.method;
    if (link.dataset.location) details.location_name = link.dataset.location;
    if (link.dataset.targetLanguage) details.target_language = link.dataset.targetLanguage;
    // Contact intent only: no lead conversion until an actual enquiry is received.
    // Do not send phone numbers, email addresses or enquiry text to analytics.
    if (link.dataset.event === 'change_language' || link.dataset.event === 'click_contact') {
      details.transport_type = 'beacon';
    }
    track(link.dataset.event, details);
  });
  document.querySelectorAll('video[data-video]').forEach(function (video) {
    var started = false;
    video.addEventListener('play', function () {
      if (started) return;
      started = true;
      track('catering_video_start', { video_name: video.dataset.video });
    });
    video.addEventListener('ended', function () {
      track('catering_video_complete', { video_name: video.dataset.video });
    });
  });
})();
