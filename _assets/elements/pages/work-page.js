// Work page
// =========

Polymer({
  is: 'work-page',

  behaviors: [
    Barvian.StylePropertiesBehavior,
    Barvian.PageBehavior,
    Polymer.NeonSharedElementAnimatableBehavior
  ],

  properties: {
    blurb: String,
    hero: String,
    hero2x: String,

    navStyle: {
      type: String,
      value() {
        return 'invert';
      }
    },

    sharedElements: {
      type: Object,
      value() {
        return {
          'hero': this.$.hero,
          'ripple': this.$.header
        }
      }
    },

    animationConfig: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'ripple-animation',
            id: 'ripple',
            toPage: this,
          }, {
            name: 'hero-animation',
            id: 'hero',
            toPage: this,
            timing: {
              delay: 150
            }
          }],
          'exit': [{
            name: 'fade-out-animation',
            node: this.$.header
          }, {
            name: 'transform-animation',
            transformFrom: 'none',
            transformTo: 'translate(0px,-200vh) scale(0.9,1)',
            node: this
          }]
        }
      }
    }
  },

  styleProperties: {
    bg: String,
    fg: String,
    shadow: String
  }
});
