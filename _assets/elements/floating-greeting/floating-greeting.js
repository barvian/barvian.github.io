// My greeting
// ===========

Polymer({
  is: 'floating-greeting',

  ready: function() {
    this._splitCharacters(this);
    console.log(this);
  },

  _splitCharacters(parent) {
    const $parent = Polymer.dom(parent);
    $parent.childNodes.forEach(node => {
      if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
        let sentence = parent === this ? document.createElement('span') : parent;
        sentence.classList.add('sentence');
        node.nodeValue.split('').forEach(ch => {
          let chNode = document.createTextNode(ch);
          if (/\s/.test(ch)) {
            sentence.appendChild(chNode);
          } else {
            let letter = document.createElement('span');
            letter.classList.add('ch');
            letter.appendChild(chNode);
            sentence.appendChild(letter);
          }
        });

        if (parent === this) {
          $parent.replaceChild(sentence, node);
        } else {
          node.remove();
        }
      } else if (node.nodeType === 1) {
        this._splitCharacters(node);
      }
    });
  }
});
