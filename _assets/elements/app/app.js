// App
// ===

Polymer({
  is: 'barvian-app',

  properties: {
    _boundOnAnimationStart: {
      type: Object,
      value() { return this._onAnimationStart.bind(this); }
    },
    _boundBeforePageEnter: {
      type: Object,
      value() { return this._beforePageEnter.bind(this); }
    },
    _boundAfterPageEnter: {
      type: Object,
      value() { return this._afterPageEnter.bind(this); }
    },
    _boundBeforePageLeave: {
      type: Object,
      value() { return this._beforePageLeave.bind(this); }
    },

    baseUrl: {
      type: String,
      value: '/'
    },
    routes: Array,
    route: String,
    currentPage: {
      type: Object,
      notify: true
    },

    shouldAnimate: {
      type: Boolean,
      value: false
    }
  },

  listeners: {
    'click': 'handleAction',
    'touchend': 'handleAction',
    'mouseup': 'handleAction',
    'keyup': 'handleAction'
  },

  attached() {
    FastClick.attach(document.body);

    this.$.pages.queryAllEffectiveChildren('.page').forEach(page => {
      page.addEventListener('entry-animation-start',
        this._boundOnAnimationStart);
      page.addEventListener('exit-animation-start',
        this._boundOnAnimationStart);

      page.addEventListener('entry-animation-start',
        this._boundBeforePageEnter);
      page.addEventListener('entry-animation-finish',
        this._boundAfterPageEnter);
      page.addEventListener('exit-animation-start',
        this._boundBeforePageEnter);
    });
  },

  detached() {
    this.$.pages.queryAllEffectiveChildren('.page').forEach(page => {
      page.removeEventListener('entry-animation-start',
        this._boundOnAnimationStart);
      page.removeEventListener('exit-animation-start',
        this._boundOnAnimationStart);

      page.removeEventListener('entry-animation-start',
        this._boundBeforePageEnter);
      page.removeEventListener('entry-animation-finish',
        this._boundAfterPageEnter);
      page.removeEventListener('exit-animation-start',
        this._boundBeforePageEnter);
    });
  },

  ready() {
    // Routes
    if (window.location.port === '') {
      page.base(this.baseUrl.replace(/\/$/, ''));
    }
    this.routes.forEach(route => {
      page(route, () => this.route = route);
    });
    page({hashbang: false});
  },

  // Only animate when clicking
  handleAction(event) {
    let {target} = event;
    do {
      if (target.nodeType !== Node.TEXT_NODE &&
        target.tagName === 'A' &&
        !target.getAttribute('href').startsWith('mailto:')) {
        return this.shouldAnimate = true;
      }
    } while (target = target.parentNode);
  },

  // This keeps the nav functioning on work pages
  compressRoute(route) {
    if (route.startsWith('/work/')) {
      return '/';
    }
    return route;
  },

  _onAnimationStart(event) {
    const {fromPage, toPage} = event.detail;

    // Don't do anything unless we're animating from a previous page
    if (!this.shouldAnimate || !fromPage) {
      return;
    }

    if (fromPage.is === 'work-page' || toPage.is === 'work-page') {
      fromPage.animationConfig = fromPage.animationConfigWork;
      toPage.animationConfig = toPage.animationConfigWork;
    } else if (fromPage.order < toPage.order) {
      fromPage.animationConfig = fromPage.animationConfigRight;
      toPage.animationConfig = toPage.animationConfigRight;
    } else if (fromPage.order > toPage.order) {
      fromPage.animationConfig = fromPage.animationConfigLeft;
      toPage.animationConfig = toPage.animationConfigLeft;
    }
  },

  _beforePageEnter(event) {
    const {fromPage, toPage} = event.detail;
    if (fromPage) {
      this.scrollTo(
        this.shouldAnimate ? 0 : toPage._lastScrollTop,
        this.shouldAnimate ? undefined : 150
      );
    }
  },

  _afterPageEnter() {
    this.shouldAnimate = false;
  },

  _beforePageLeave(event) {
    const {fromPage} = event.detail;

    fromPage._lastScrollTop = this.$.pages.scrollTop;
  },

  scrollTo(top, duration = 500) {
    if (duration > 0) {
      const easingFn = function easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      };
      const animationId = Math.random();
      const startTime = Date.now();
      const currentScrollTop = this.$.pages.scrollTop;
      const deltaScrollTop = top - currentScrollTop;

      this._currentAnimationId = animationId;

      (function updateFrame() {
        const now = Date.now();
        const elapsedTime = now - startTime;

        if (elapsedTime > duration) {
          this.$.pages.scrollTop = top;
        } else if (this._currentAnimationId === animationId) {
          this.$.pages.scrollTop = easingFn(elapsedTime, currentScrollTop,
            deltaScrollTop, duration);
          requestAnimationFrame(updateFrame.bind(this));
        }
      }).call(this);
    } else {
      this.$.pages.scrollTop = top;
    }
  },

  scrollToTop(animated = true) {
    this.scrollTo(0, animated ? undefined : 0);
  }
});
