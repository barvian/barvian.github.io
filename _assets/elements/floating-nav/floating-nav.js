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
    Polymer.dom(this).classList.remove('modal');
    this.shadow = '';

    if (!navStyle) {
      return;
    }

    if (navStyle.invert) {
      Polymer.dom(this).classList.add('invert');
    }
    if (navStyle.modal) {
      Polymer.dom(this).classList.add('modal');
    }
    this.shadow = navStyle.shadow || '';
  }
});
