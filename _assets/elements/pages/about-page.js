// About page
// ==========

Polymer({
  is: 'about-page',

  behaviors: [
    Polymer.PageBehavior
  ],

  properties: {
    animationConfig: {
      type: Object,
      value: function() {
        return {
          'entry': {
            name: 'slide-from-left-animation',
            node: this
          }
        }
      }
    }
  }
});
