// Page behavior
// =============

window.Barvian = window.Barvian || {};
Barvian.PageBehavior = {

  behaviors: [
    Polymer.NeonAnimatableBehavior,
    Polymer.NeonAnimationRunnerBehavior
  ],

  properties: {
    animationConfig: {
      value: function() {
        return {
          'entry': [{
            name: 'cascaded-animation',
            animation: 'scale-up-animation',
            nodes: this.getEffectiveChildren()
          }],
          'exit': [{
            name: 'cascaded-animation',
            animation: 'scale-down-animation',
            nodes: this.getEffectiveChildren()
          }]
        }
      }
    },
    pageTitle: {
      type: String,
      value: null
    },
    order: {
      type: Number,
      value: 0
    }
  }

};
