// Button
// ======

Polymer({
  is: 'barvian-button',
  extends: 'a',

  behaviors: [
    Polymer.IronControlState
  ],

  properties: {
    invert: Boolean
  }
});
