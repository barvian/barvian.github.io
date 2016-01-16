// Page behavior
// =============

Polymer.PageBehavior = {

  behaviors: [
    Polymer.NeonAnimatableBehavior,
    Polymer.NeonAnimationRunnerBehavior
  ],

  properties: {
    pageTitle: {
      type: String,
      value: null
    }
  }

};
