(function () {
  function track(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      event_category: 'breakfast',
      language: document.documentElement.lang,
      page_path: location.pathname
    }, params));
  }

  track('view_breakfast', { location_name: 'tre_canne' });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    if (link.closest('.lang-switch')) {
      if (link.getAttribute('aria-current') === 'page') return;
      track('change_language', {
        target_language: link.getAttribute('lang'),
        link_url: link.href,
        transport_type: 'beacon'
      });
    } else if (link.classList.contains('inside-link')) {
      track('click_find_inside', {
        location_name: 'tre_canne',
        placement: link.closest('.sticky') ? 'sticky' : link.closest('.loc') ? 'location' : 'hero',
        link_url: link.href,
        transport_type: 'beacon'
      });
    } else if (link.matches('.cta, .loc a, .sticky a')) {
      track('click_directions', {
        location_name: 'tre_canne',
        placement: link.closest('.sticky') ? 'sticky' : link.closest('.loc') ? 'location' : 'hero',
        link_url: link.href
      });
    } else if (link.hostname === 'www.instagram.com') {
      track('click_social', { event_category: 'navigation', event_label: 'instagram', placement: 'breakfast_footer', link_url: link.href });
    }
  });
})();
