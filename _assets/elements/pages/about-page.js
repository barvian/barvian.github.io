// About page
// ==========

Polymer({
  is: 'about-page',

  properties: {
    _boundObserver: {
      type: Object,
      value() { return this._childrenChanged.bind(this); }
    }
  },

  behaviors: [
    Barvian.PageBehavior
  ],

  attached() {
    console.log(Polymer.dom(this.$.img).getDistributedNodes());
    this._observer = Polymer.dom(this.$.img)
      .observeNodes(this._boundObserver);
  },

  _childrenChanged(info) {
    const distributedNodes = Polymer.dom(this.$.img).getDistributedNodes();
    distributedNodes
      // Append to correct ul
      .forEach(node => {
        Polymer.dom(this.$.svgImg).appendChild(node);
        console.log(node);
      });
  },

  detached() {
    Polymer.dom(this.$.img).unobserveNodes(this._boundObserver);
  }
});
