// Floating nav
// ============

Polymer({
  is: 'floating-nav',
  extends: 'nav',

  behaviors: [
    Polymer.IronMenuBehavior
  ],

  hostAttributes: {
    role: 'navigation'
  },

  properties: {
    selectedPage: Object
  },

  observers: [
    'updateStyle(selectedPage.navStyle)'
  ],

  updateStyle(navStyle) {
    Polymer.dom(this).classList.remove('invert');
    Polymer.dom(this).classList.add(navStyle);
    Polymer.dom.flush();
    this.updateStyles();
  }
});
