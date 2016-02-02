import page from 'page';

// Routing
// =======

window.addEventListener('WebComponentsReady', () => {
  // Removes end / from app.baseUrl which page.base requires for production
  if (window.location.port === '') {
    page.base(app.baseUrl.replace(/\/$/, ''));
  }

  // Routes
  // ------

  // Static pages
  [app.baseUrl, '/about/', '/contact/'].forEach(url => {
    page(url, () => app.route = url);
  });

  // Works
  page('/work/:name', data => {
    app.route = `/work/${data.params.name}/`;
  });

  page({
    hashbang: false
  });
});
