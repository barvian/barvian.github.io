const {NeonAnimatableBehavior, NeonPageBehavior} = Polymer;

// Page behavior
// =============

window.Barvian = window.Barvian || {};
Barvian.PageBehavior = [NeonAnimatableBehavior, NeonPageBehavior, {

  properties: {
    pageTitle: String,
    order: Number,
    navStyle: String,

    _boundPageChange: {
      type: Object,
      value() { return this._onPageChange.bind(this) }
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
            timing: { duration: 500 }
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
            timing: { duration: 500 }
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
            timing: { duration: 500 }
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
            timing: { duration: 500 }
          }]
        }
      }
    }
  },

  listeners: {
    'entry-animation-start': '_onEntryAnimation'
  },

  attached() {
    this.addEventListener('entry-animation-start', this._boundPageChange);
    this.addEventListener('exit-animation-start', this._boundPageChange);
  },

  detached() {
    this.removeEventListener('entry-animation-start', this._boundPageChange);
    this.removeEventListener('exit-animation-start', this._boundPageChange);
  },

  _onEntryAnimation(event) {
    if (event.detail.fromPage) {
      this.scrollToTop();
    }
  },

  _onPageChange(event) {
    const {fromPage, toPage} = event.detail;

    if (fromPage) {
      this.animationConfig = (fromPage.order < toPage.order) ?
        this.animationConfigRight :
        this.animationConfigLeft;
    }
  },

  scroll(top, duration = 500) {
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
    this.scroll(0, animated ? undefined : 0);
  }

}];
