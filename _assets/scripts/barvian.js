import * as config from '../../_config.yml';
import pictureFill from 'picturefill'; // eslint-disable-line no-unused-vars
import routing from './routing'; // eslint-disable-line no-unused-vars
import attachFastClick from 'fastclick';

// barvian.me
// ==========

// Fast click for all
attachFastClick(document.body);

// Grab a reference to our auto-binding template
// and give it some initial binding values
const app = document.getElementById('app');

// Set app base URL to one specified in Jekyll config
app.baseUrl = config.baseurl || '/';

Object.defineProperty(app, 'scroller', {
  get() {
    return this.$.pages;
  }
});

// Scroll scroller
app.scroll = function(top, duration = 200) {
  if (duration > 0) {
    const easingFn = function easeOutQuad(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    };
    const animationId = Math.random();
    const startTime = Date.now();
    const currentScrollTop = this.scroller.scrollTop;
    const deltaScrollTop = top - currentScrollTop;

    this._currentAnimationId = animationId;

    (function updateFrame() {
      const now = Date.now();
      const elapsedTime = now - startTime;

      if (elapsedTime > duration) {
        this.scroller.scrollTop = top;
      } else if (this._currentAnimationId === animationId) {
        this.scroller.scrollTop = easingFn(elapsedTime, currentScrollTop,
          deltaScrollTop, duration);
        requestAnimationFrame(updateFrame.bind(this));
      }
    }).call(this);
  } else {
    this.scroller.scrollTop = top;
  }
};

// Scroll scroller to top
app.scrollPageToTop = function() {
  this.scroll(0);
};
