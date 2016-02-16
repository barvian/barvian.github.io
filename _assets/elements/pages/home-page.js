// Home page
// =========

Polymer({
  is: 'home-page',

  behaviors: [
    Polymer.NeonSharedElementAnimatableBehavior,
    Barvian.PageBehavior
  ],

  properties: {
    animationConfigWork: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'fade-in-animation',
            node: this,
            timing: { duration: 100 }
          }],
          'exit': [{
            name: 'hero-animation',
            id: 'bg',
            fromPage: this
          }, {
            name: 'hero-animation',
            id: 'hero',
            fromPage: this
          }, {
            name: 'fade-out-animation',
            node: this.$.works,
            timing: { duration: 150 }
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

    // trick neon-page-behavior so it defaults to these elements & config
    this._neonPageBehaviorInitialized = false;
    // configure page animation
    this.sharedElements = {
      hero: work.$.image,
      bg: work.$.bg
    };
    this.animationConfigWork['exit'][0].gesture = {
      x: event.x,
      y: event.y
    };

    this.fire('work-click', {work});
  }
});
