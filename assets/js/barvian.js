let rellax
if (document.querySelectorAll('.js-rellax').length > 0) {
  rellax = new Rellax('.js-rellax')
}

// Popup
if (sessionStorage.getItem('hasSeenPopup')) {
  document.documentElement.classList.add('has-seen-popup')
}
sessionStorage.setItem('hasSeenPopup', true)
