// Invertible behavior
// ===================

window.Barvian = window.Barvian || {};
Barvian.InvertibleBehavior = function(invertibleProp, reflectToClass = true) {
  return {

    properties: {
      invert: {
        type: Boolean,
        computed: `_computeInverted(${invertibleProp})`
      }
    },

    observers: [
      '_updateInverted(invert)'
    ],

    _computeInverted(prop) {
      const rgb = prop.match(/\d+/g).map(Number);
      const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

      return yiq < 175;
    },

    _updateInverted(invert) {
      if (reflectToClass) {
        this.classList[invert ? 'add' : 'remove']('invert');
      }
    }

  };
};
