// Work page
// =========

Polymer({
  is: 'work-page',

  behaviors: [
    Barvian.StyleReflectionBehavior,
    Barvian.InvertibleBehavior('base'),
    Barvian.PageBehavior,
    Polymer.NeonSharedElementAnimatableBehavior
  ],

  properties: {
    base: {reflectToStyle: true},
    primary: {reflectToStyle: true},
    secondary: {reflectToStyle: true},
    shadow: {reflectToStyle: true},

    workTitle: String,
    description: String,
    type: String,
    url: String,

    hero: String,
    hero2x: String,

    navStyle: {
      type: String,
      computed: '_computeNavStyle(base, shadow)'
    },

    hasLink: {
      type: Boolean,
      computed: '_computeHasLink(type, url)'
    },

    sharedElements: {
      type: Object,
      value() {
        return {
          hero: this.$.heroImg,
          bg: this.$.bg
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

  _computeNavStyle(base, shadow) {
    const rgb = base.match(/\d+/g).map(Number);
    const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    return {
      modal: true,
      shadow,
      ...(yiq < 175 ? {invert: true} : {})
    };
  },

  _computeHasLink(type, url) {
    return type === 'web' && url;
  }
});
