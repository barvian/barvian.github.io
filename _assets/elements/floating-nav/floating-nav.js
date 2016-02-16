// Floating nav
// ============

Polymer({
  is: 'floating-nav',
  extends: 'nav',

  behaviors: [
    Barvian.StyleReflectionBehavior,
    Polymer.IronMenuBehavior
  ],

  hostAttributes: {
    role: 'navigation'
  },

  properties: {
    shadow: {reflectToStyle: true},

    selectedPage: Object
  },

  observers: [
    'updateStyle(selectedPage.navStyle)'
  ],

  updateStyle(navStyle) {
    Polymer.dom(this).classList.remove('invert');
    this.shadow = '';

    if (!navStyle) {
      return;
    }

    if (navStyle.invert) {
      Polymer.dom(this).classList.add('invert');
    }
    this.shadow = navStyle.shadow || '';
  }
});
