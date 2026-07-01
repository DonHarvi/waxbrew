(function () {
  var GA_ID = "G-PMMNXCF8LX";
  var REDIRECT_DELAY_MS = 1200;

  function loadGoogleAnalytics(callback) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    script.onload = callback;
    document.head.appendChild(script);

    window.gtag("js", new Date());
  }

  function trackAndRedirect(config) {
    document.title = config.pageTitle;

    loadGoogleAnalytics(function () {
      window.gtag("config", GA_ID, {
        page_path: config.pagePath,
        page_title: config.pageTitle
      });

      window.gtag("event", config.eventName, {
        event_category: "redirect",
        event_label: config.label,
        redirect_target: config.label,
        event_callback: function () {
          window.location.href = config.targetUrl;
        },
        event_timeout: 1000
      });
    });

    setTimeout(function () {
      window.location.href = config.targetUrl;
    }, REDIRECT_DELAY_MS);
  }

  window.WaxBrewRedirect = {
    trackAndRedirect: trackAndRedirect
  };
})();
