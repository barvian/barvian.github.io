// Page behavior
// =============

window.Barvian = window.Barvian || {};
Barvian.PageBehavior = {

  behaviors: [
    Polymer.NeonAnimatableBehavior
  ],

  properties: {
    pageTitle: {
      type: String,
      value: null
    },
    order: {
      type: Number,
      value: 0
    }
  },

  exitAnimation() {
    return {
      'entry': [{
        node: this.$.content,
        name: 'slide-from-left-animation',
      }, {
        node: this.$.content,
        name: 'fade-in-animation'
      }],
      'exit': [{
        node: this.$.content,
        name: 'slide-left-animation'
      }, {
        node: this.$.content,
        name: 'fade-out-animation'
      }]
    };
  }

};
