const {NeonAnimatableBehavior, NeonPageBehavior} = Polymer;

// Page behavior
// =============

window.Barvian = window.Barvian || {};
Barvian.PageBehavior = [NeonAnimatableBehavior, NeonPageBehavior, {

  properties: {
    pageTitle: String,
    order: Number,
    navStyle: String,

    // This will be used as a backup (mostly with history)
    animationConfig: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'fade-in-animation',
            node: this,
            timing: { duration: 150 }
          }],
          'exit': [{
            name: 'fade-out-animation',
            node: this,
            timing: { duration: 150 }
          }]
        }
      }
    },

    animationConfigLeft: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'transform-animation',
            node: this,
            transformFrom: 'translateX(-20%)',
            transformTo: 'translateX(0)',
            timing: { duration: 500, easing: 'ease-out' }
          }, {
            name: 'fade-in-animation',
            node: this,
            timing: { duration: 400 }
          }],
          'exit': [{
            name: 'transform-animation',
            node: this,
            transformFrom: 'translateX(0)',
            transformTo: 'translateX(20%)',
            timing: { duration: 500, easing: 'ease-in' }
          }, {
            name: 'fade-out-animation',
            node: this,
            timing: { duration: 400 }
          }]
        }
      }
    },

    animationConfigRight: {
      type: Object,
      value() {
        return {
          'entry': [{
            name: 'transform-animation',
            node: this,
            transformFrom: 'translateX(20%)',
            transformTo: 'translateX(0)',
            timing: { duration: 500, easing: 'ease-out' }
          }, {
            name: 'fade-in-animation',
            node: this,
            timing: { duration: 400 }
          }],
          'exit': [{
            name: 'transform-animation',
            node: this,
            transformFrom: 'translateX(0)',
            transformTo: 'translateX(-20%)',
            timing: { duration: 500, easing: 'ease-in' }
          }, {
            name: 'fade-out-animation',
            node: this,
            timing: { duration: 400 }
          }]
        }
      }
    }
  }

}];
