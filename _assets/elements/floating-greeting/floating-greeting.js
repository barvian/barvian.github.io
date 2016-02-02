// Floating greeting
// =================

Polymer({
  is: 'floating-greeting',
  extends: 'h1',

  ready() {
    this._splitCharacters(this.$.content, true);
  },

  _splitCharacters(parent, distributed = false) {
    (distributed ?
      Polymer.dom(parent).getDistributedNodes() :
      Polymer.dom(parent).childNodes
    ).forEach(node => {
      if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
        let sentence = parent === this ? document.createElement('span') : parent;
        Polymer.dom(sentence).classList.add('sentence');
        node.nodeValue.split('').forEach(ch => {
          let chNode = document.createTextNode(ch);
          if (/\s/.test(ch)) {
            Polymer.dom(sentence).appendChild(chNode);
          } else {
            let letter = document.createElement('span');
            Polymer.dom(letter).classList.add('ch');
            Polymer.dom(letter).appendChild(chNode);
            Polymer.dom(sentence).appendChild(letter);
          }
        });

        if (parent === this) {
          Polymer.dom(parent).replaceChild(sentence, node);
        } else {
          Polymer.dom(node.parentNode).removeChild(node);
        }
      } else if (node.nodeType === 1) {
        this._splitCharacters(node);
      }
    });
  }
});
