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
      computed: '_computeNavStyle(bg)'
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
  },

  _computeNavStyle(bg) {
    const rgb = bg.match(/\d+/g).map(Number);
    const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    return yiq < 175 ? 'invert' : '';
  }
});
