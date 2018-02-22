---
---

{% include_relative js/lib/rellax/rellax.min.js %}

let rellax
if (document.querySelectorAll('.js-rellax').length > 0) {
  rellax = new Rellax('.js-rellax')
}
