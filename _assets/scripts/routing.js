import page from 'page';

// Routing
// =======

window.addEventListener('WebComponentsReady', () => {
  // Removes end / from app.baseUrl which page.base requires for production
  if (window.location.port === '') {
    page.base(app.baseUrl.replace(/\/$/, ''));
  }

  // Middleware
  // ----------

  function scrollToTop(ctx, next) {
    app.scrollPageToTop();
    next();
  }

  // Routes
  // ------

  page('*', scrollToTop, function(ctx, next) {
    next();
  });

  // Static pages
  [app.baseUrl, '/about/', '/contact/'].forEach(url => {
    page(url, () => app.route = url);
  });

  page({
    hashbang: false
  });
});
