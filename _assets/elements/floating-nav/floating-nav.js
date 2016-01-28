// Floating nav
// ============

Polymer({
  is: 'floating-nav',
  extends: 'nav',

  properties: {
    currentPage: Object
  },

  observers: [
    'updateStyle(currentPage.navStyle)'
  ],

  attached() {
    this._observer = Polymer.dom(this.$.content)
      .observeNodes(this._childrenChanged.bind(this));
  },

  _childrenChanged(info) {
    const distributedNodes = Polymer.dom(this.$.content).getDistributedNodes();
    const {length} = distributedNodes;
    distributedNodes
      // Wrap in li
      .map(node => {
        const li = document.createElement('li');
        Polymer.dom(li).appendChild(node);

        return li;
      })
      // Append to correct ul
      .forEach((node, i) => {
        Polymer.dom(i < length / 2 ? this.$.left : this.$.right)
          .appendChild(node);
      });
  },

  updateStyle(navStyle) {
    Polymer.dom(this).classList.remove('invert');
    Polymer.dom(this).classList.add(navStyle);
    Polymer.dom.flush();
    this.updateStyles();
  },

  detached() {
    Polymer.dom(this.$.content).unobserveNodes(this._observer);
  }
});
