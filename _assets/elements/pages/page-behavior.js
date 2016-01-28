const {NeonAnimatableBehavior, NeonPageBehavior} = Polymer;

// Page behavior
// =============

window.Barvian = window.Barvian || {};
Barvian.PageBehavior = [NeonAnimatableBehavior, NeonPageBehavior, {

  properties: {
    pageTitle: String,
    order: Number,

    // animationConfig: {
    //   type: Object,
    //   value() {
    //     return {
    //       'entry': [{
    //         name: 'fade-in-animation',
    //         node: this
    //       }],
    //       'exit': [{
    //         name: 'fade-out-animation',
    //         node: this
    //       }]
    //     }
    //   }
    // }
  },

  listeners: {
    'entry-animation-start': '_onEntryStart'
  },

  _onEntryStart(event) {
  }

}];
