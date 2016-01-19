// Work card
// =========

Polymer({
  is: 'work-card',
  extends: 'article',

  properties: {
    href: String,
    title: String,
    bg: String,
    fg: String
  },

  ready() {
    if (this.href) {
      this.innerHTML =
        `<a href="${this.href}">
          ${this.innerHTML}
        </a>`;
    }

    this.customStyle['--work-card-bg'] = this.bg;
    this.customStyle['--work-card-fg'] = this.fg;
  },

  loaded(event) {
    this.classList.add('loaded');
  }
});
