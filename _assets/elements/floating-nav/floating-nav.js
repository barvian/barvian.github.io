// Floating nav
// ============

Polymer({
  is: 'floating-nav',
  extends: 'nav',

  behaviors: [
    Barvian.StylePropertiesBehavior,
    Polymer.IronMenuBehavior
  ],

  hostAttributes: {
    role: 'navigation'
  },

  properties: {
    selectedPage: Object
  },

  styleProperties: {
    shadow: String
  },

  observers: [
    'updateStyle(selectedPage.navStyle)'
  ],

  updateStyle(navStyle) {
    Polymer.dom(this).classList.remove('invert');
    if (!navStyle) {
      return;
    }

    if (navStyle.invert) {
      Polymer.dom(this).classList.add('invert');
    }
    this.shadow = navStyle.shadow;

    Polymer.dom.flush();
    this.updateStyles();
  }
});
