import * as config from '../../_config.yml';
import pictureFill from 'picturefill'; // eslint-disable-line no-unused-vars
import routing from './routing'; // eslint-disable-line no-unused-vars
import attachFastClick from 'fastclick';

// barvian.me
// ==========

(function(document) {
  // Fast click for all
  attachFastClick(document.body);

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  const app = document.getElementById('app');

  // Set app base URL to one specified in Jekyll config
  app.baseUrl = config.baseurl || '/';

  // Only animate when clicking
  const handleAction = event => {
    let {target} = event;
    do {
      if (target.nodeType !== Node.TEXT_NODE &&
        target.tagName === 'A' &&
        !target.getAttribute('href').startsWith('mailto:')) {
        return app.shouldAnimate = true; // eslint-disable-line no-return-assign
      }
    } while (target = target.parentNode); // eslint-disable-line no-cond-assign
  };
  ['click', 'touchend', 'mouseup', 'keyup'].forEach(event => {
    document.addEventListener(event, handleAction);
  });

  // This keeps the nav functioning on work pages
  app.compressRoute = function(route) {
    if (route.startsWith('/work/')) {
      return '/';
    }
    return route;
  };
})(document);
