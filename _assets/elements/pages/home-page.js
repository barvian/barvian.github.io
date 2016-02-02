// Home page
// =========

Polymer({
  is: 'home-page',

  behaviors: [
    Polymer.NeonSharedElementAnimatableBehavior,
    Barvian.PageBehavior
  ],

  properties: {
    animationConfig: {
      type: Object,
      value() {
        return {
          'exit': [{
            name: 'ripple-animation',
            id: 'ripple',
            fromPage: this
          }, {
            name: 'hero-animation',
            id: 'hero',
            fromPage: this
          }]
        }
      }
    }
  },

  listeners: {
    'works.click': '_onClick'
  },

  _onClick(event) {
    let work = event.target;
    while (work.parentNode !== this.$.works) {
      work = work.parentNode;
    }

    // configure page animation
    this.sharedElements = {
      hero: work.$.image,
      ripple: work.$.bg
    };
    this.animationConfig['exit'][0].gesture = {
      x: event.x,
      y: event.y
    };

    this.fire('work-click', {work});
  }
});
