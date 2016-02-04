import * as config from '../../_config.yml';
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

  window.addEventListener('WebComponentsReady', () => {
    Polymer.dom(app.$.pages).children.forEach(child => {
      child.addEventListener('entry-animation-start',
        app._beforePageEnter.bind(this));
      child.addEventListener('entry-animation-finish',
        app._afterPageEnter.bind(this));
      child.addEventListener('exit-animation-start',
        app._beforePageLeave.bind(this));
    })
  });

  // Only animate when clicking
  const handleAction = event => {
    let {target} = event;
    do {
      if (target.nodeType !== Node.TEXT_NODE &&
        target.tagName === 'A' &&
        !target.getAttribute('href').startsWith('mailto:')) {
        return app.shouldAnimate = true;
      }
    } while (target = target.parentNode);
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

  app._beforePageEnter = function(event) {
    const {fromPage, toPage} = event.detail;
    if (fromPage) {
      app.scrollTo(
        app.shouldAnimate ? 0 : toPage._lastScrollTop,
        app.shouldAnimate ? undefined : 150
      );
    }
  };

  app._afterPageEnter = function(event) {
    app.shouldAnimate = false;
  };

  app._beforePageLeave = function(event) {
    event.detail.fromPage._lastScrollTop = app.$.pages.scrollTop;
  };

  app.scrollTo = function(top, duration = 500) {
    if (duration > 0) {
      const easingFn = function easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      };
      const animationId = Math.random();
      const startTime = Date.now();
      const currentScrollTop = app.$.pages.scrollTop;
      const deltaScrollTop = top - currentScrollTop;

      this._currentAnimationId = animationId;

      (function updateFrame() {
        const now = Date.now();
        const elapsedTime = now - startTime;

        if (elapsedTime > duration) {
          app.$.pages.scrollTop = top;
        } else if (this._currentAnimationId === animationId) {
          app.$.pages.scrollTop = easingFn(elapsedTime, currentScrollTop,
            deltaScrollTop, duration);
          requestAnimationFrame(updateFrame.bind(this));
        }
      }).call(this);
    } else {
      app.$.pages.scrollTop = top;
    }
  };

  app.scrollToTop = function(animated = true) {
    this.scrollTo(0, animated ? undefined : 0);
  };
})(document);
