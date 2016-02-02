const {NeonAnimatableBehavior, NeonPageBehavior} = Polymer;

// Page behavior
// =============

window.Barvian = window.Barvian || {};
Barvian.PageBehavior = [NeonAnimatableBehavior, NeonPageBehavior, {

  properties: {
    pageTitle: String,
    order: Number,
    navStyle: String,

    animationConfigLeft: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'slide-from-left-animation',
            node: this
          }],
          'exit': [{
            name: 'slide-right-animation',
            node: this
          }]
        }
      }
    },

    animationConfigRight: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'slide-from-right-animation',
            node: this
          }],
          'exit': [{
            name: 'slide-left-animation',
            node: this
          }]
        }
      }
    }
  },

  listeners: {
    'entry-animation-start': '_onPageChange',
    'exit-animation-start': '_onPageChange'
  },

  _onPageChange(event) {
    const {fromPage, toPage} = event.detail;

    if (fromPage) {
      this.animationConfig = (fromPage.order < toPage.order) ?
        this.animationConfigRight :
        this.animationConfigLeft;
    }
  }

}];
