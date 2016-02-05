// Work card
// =========

Polymer({
  is: 'work-card',

  behaviors: [
    Barvian.StyleReflectionBehavior
  ],

  properties: {
    bg: {reflectToStyle: true},
    fg: {reflectToStyle: true},
    shadow: {reflectToStyle: true},

    href: String,
    workTitle: String,
    blurb: String,
    thumb: String,
    thumb2x: String,
    orientation: String,

    invert: {
      type: Boolean,
      computed: '_computeInverted(bg)'
    }
  },

  observers: [
    'updateInverted(invert)',
    'updateLink(href)',
    'updateOrientation(orientation)'
  ],

  ready() {
  },

  updateLink(href) {
    if (!this.link) {
      this.link = document.createElement('a');
      Polymer.dom(this.$.wrapper).appendChild(this.link);
      Polymer.dom(this.$.wrapper).childNodes
        .filter(child => child !== this.link)
        .forEach(child => Polymer.dom(this.link).appendChild(child));
    }

    Polymer.dom(this.link).setAttribute('href', href);
  },

  updateInverted(invert) {
    this.classList[invert ? 'add' : 'remove']('invert');
  },

  updateOrientation(orientation) {
    this.classList.remove('portrait', 'landscape');
    this.classList.add(orientation);
  },

  _imgLoaded(event) {
    this.classList.add('loaded');
  },

  _computeInverted(bg) {
    const rgb = bg.match(/\d+/g).map(Number);
    const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    return yiq < 175 ? 'invert' : '';
  }
});
