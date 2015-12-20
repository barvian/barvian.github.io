// My greeting
// ===========

Polymer({
  is: 'my-greeting',

  properties: {
    greeting: {
      type: String,
      value: 'Welcome!',
      notify: true
    }
  },

  created: function() {
  }
});
