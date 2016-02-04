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
    shadow: {reflectToStyle: true, type: String},

    selectedPage: Object
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
    console.log(navStyle.shadow)
    this.shadow = navStyle.shadow;
  }
});
