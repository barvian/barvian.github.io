// Work card
// =========

Polymer({
  is: 'work-card',

  behaviors: [
    Barvian.StylePropertiesBehavior
  ],

  properties: {
    href: String,
    title: String,
    blurb: String,
    thumb: String,
    thumb2x: String,
    orientation: {
      type: String,
      computed: '_computeOrientation(aspect)'
    }
  },

  styleProperties: {
    bg: String,
    fg: String,
    shadow: String,
    aspect: Number
  },

  observers: [
    'updateLink(href)',
    'updateOrientation(orientation)'
  ],

  ready() {
    this.updateLink(this.href);
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

  updateOrientation(orientation) {
    this.classList.remove('portrait', 'landscape');
    this.classList.add(orientation);
  },

  _imgLoaded(event) {
    this.classList.add('loaded');
  },

  _computeOrientation(aspect) {
    return aspect > 1 ? 'portrait' : 'landscape';
  }
});
