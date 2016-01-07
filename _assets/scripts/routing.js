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

  page(app.baseUrl, function() {
    app.route = '/';
  });

  page('/about/', function() {
    app.route = '/about/';
  });

  page('/contact/', function() {
    app.route = '/contact/';
  });

  page({
    hashbang: false
  });
});
