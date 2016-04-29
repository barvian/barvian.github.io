// Work card
// =========

Polymer({
  is: 'work-card',

  behaviors: [
    Barvian.StyleReflectionBehavior,
    Barvian.InvertibleBehavior('base')
  ],

  properties: {
    base: {reflectToStyle: true},
    primary: {reflectToStyle: true},
    secondary: {reflectToStyle: true},
    shadow: {reflectToStyle: true},

    href: String,
    workTitle: String,
    blurb: String,
    thumb: String,
    thumb2x: String,
    orientation: String
  },

  observers: [
    'updateLink(href)',
    'updateOrientation(orientation)'
  ],

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
  }
});
