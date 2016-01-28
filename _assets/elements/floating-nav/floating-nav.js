// Floating nav
// ============

Polymer({
  is: 'floating-nav',
  extends: 'nav',

  properties: {
    currentPage: Object
  },

  observers: [
    'matchStyles(currentPage)'
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

  matchStyles(page) {
    Polymer.dom(this).classList.remove('invert');
    if (page && page.navStyle) {
      Polymer.dom(this).classList.add(page.navStyle);
    }
    Polymer.dom.flush();
    this.updateStyles();
  },

  detached() {
    Polymer.dom(this.$.content).unobserveNodes(this._observer);
  }
});
