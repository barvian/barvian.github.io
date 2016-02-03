const {NeonAnimatableBehavior, NeonPageBehavior} = Polymer;

// Page behavior
// =============

window.Barvian = window.Barvian || {};
Barvian.PageBehavior = [NeonAnimatableBehavior, NeonPageBehavior, {

  properties: {
    pageTitle: String,
    order: Number,
    navStyle: String,

    shouldAnimate: {
      type: Boolean,
      value: false,
      notify: true
    },

    animationConfig: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'fade-in-animation',
            node: this,
            timing: { duration: 150 }
          }],
          'exit': [{
            name: 'fade-out-animation',
            node: this,
            timing: { duration: 150 }
          }]
        }
      }
    },

    animationConfigLeft: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'transform-animation',
            node: this,
            transformFrom: 'translateX(-20%)',
            transformTo: 'translateX(0)',
            timing: { duration: 500, easing: 'ease-out' }
          }, {
            name: 'fade-in-animation',
            node: this,
            timing: { duration: 400 }
          }],
          'exit': [{
            name: 'transform-animation',
            node: this,
            transformFrom: 'translateX(0)',
            transformTo: 'translateX(20%)',
            timing: { duration: 500, easing: 'ease-in' }
          }, {
            name: 'fade-out-animation',
            node: this,
            timing: { duration: 400 }
          }]
        }
      }
    },

    animationConfigRight: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'transform-animation',
            node: this,
            transformFrom: 'translateX(20%)',
            transformTo: 'translateX(0)',
            timing: { duration: 500, easing: 'ease-out' }
          }, {
            name: 'fade-in-animation',
            node: this,
            timing: { duration: 400 }
          }],
          'exit': [{
            name: 'transform-animation',
            node: this,
            transformFrom: 'translateX(0)',
            transformTo: 'translateX(-20%)',
            timing: { duration: 500, easing: 'ease-in' }
          }, {
            name: 'fade-out-animation',
            node: this,
            timing: { duration: 400 }
          }]
        }
      }
    }
  },

  listeners: {
    'entry-animation-start': '_beforePageChange',
    'exit-animation-start': '_beforePageChange',
    'entry-animation-finish': '_afterPageChange',
    'exit-animation-finish': '_afterPageChange'
  },

  _beforePageChange(event) {
    const {fromPage, toPage} = event.detail;

    if (event.type === 'entry-animation-start' && fromPage) {
      this.scrollTo(
        this.shouldAnimate ? 0 : this._lastScrollTop,
        this.shouldAnimate ? undefined : 150
      );
    }

    if (event.type === 'exit-animation-start') {
      this._lastScrollTop = this.parentElement.scrollTop;
    }

    // Don't do anything unless we're animating from a previous page
    if (!this.shouldAnimate) {
      return;
    }

    if (fromPage.is === 'work-page' || toPage.is === 'work-page') {
      this.animationConfig = this.animationConfigWork;
    } else if (fromPage) {
      this.animationConfig = (fromPage.order < toPage.order) ?
        this.animationConfigRight :
        this.animationConfigLeft;
    }
  },

  _afterPageChange(event) {
    this.shouldAnimate = false;
  },

  scrollTo(top, duration = 500) {
    if (duration > 0) {
      const easingFn = function easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      };
      const animationId = Math.random();
      const startTime = Date.now();
      const currentScrollTop = this.parentElement.scrollTop;
      const deltaScrollTop = top - currentScrollTop;

      this._currentAnimationId = animationId;

      (function updateFrame() {
        const now = Date.now();
        const elapsedTime = now - startTime;

        if (elapsedTime > duration) {
          this.parentElement.scrollTop = top;
        } else if (this._currentAnimationId === animationId) {
          this.parentElement.scrollTop = easingFn(elapsedTime, currentScrollTop,
            deltaScrollTop, duration);
          requestAnimationFrame(updateFrame.bind(this));
        }
      }).call(this);
    } else {
      this.parentElement.scrollTop = top;
    }
  },

  scrollToTop(animated = true) {
    this.scrollTo(0, animated ? undefined : 0);
  }

}];
