// Work page
// =========

Polymer({
  is: 'work-page',

  behaviors: [
    Barvian.StyleReflectionBehavior,
    Barvian.PageBehavior,
    Polymer.NeonSharedElementAnimatableBehavior
  ],

  properties: {
    bg: {reflectToStyle: true},
    fg: {reflectToStyle: true},
    shadow: {reflectToStyle: true},

    workTitle: String,
    blurb: String,
    hero: String,
    hero2x: String,

    navStyle: {
      type: String,
      computed: '_computeNavStyle(bg, shadow)'
    },

    sharedElements: {
      type: Object,
      value() {
        return {
          hero: this.$.hero,
          bg: this.$.header
        }
      }
    },

    animationConfigWork: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'hero-animation',
            id: 'bg',
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
            node: this
          }, {
            name: 'transform-animation',
            transformFrom: 'none',
            transformTo: 'translate(0px,100vh) scale(0.75)',
            node: this.$.hero
          }]
        }
      }
    }
  },

  _computeNavStyle(bg, shadow) {
    const rgb = bg.match(/\d+/g).map(Number);
    const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    return yiq < 175 ? {
      invert: true,
      shadow
    } : {};
  }
});
