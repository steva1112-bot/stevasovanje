// Egipat navigacija fix
(function() {
  function init() {
    var slides = document.querySelectorAll('#egipat-pages .book-page-slide');
    var counter = document.getElementById('egipat-counter');
    var prevBtn = document.getElementById('egipat-prev');
    var nextBtn = document.getElementById('egipat-next');
    var current = 0;

    if (!slides.length) return;

    function showPage(n) {
      slides.forEach(function(s, i) { s.classList.toggle('active', i === n); });
      if (counter) counter.textContent = (n + 1) + ' / ' + slides.length;
      if (prevBtn) prevBtn.disabled = (n === 0);
      if (nextBtn) nextBtn.disabled = (n === slides.length - 1);
    }

    window.egipatCurrentPage = 0;
    window.egipatShowPage = showPage;
    window.egipatNext = function() { if (current < slides.length - 1) showPage(++current); };
    window.egipatPrev = function() { if (current > 0) showPage(--current); };
    window.egipatSetup = function() { current = 0; showPage(0); };

    // Patch the egipat card onclick
    var card = document.querySelector('[onclick*="openPage(\'egipat\')"]');
    if (card) {
      var orig = card.getAttribute('onclick');
      if (orig && !orig.includes('egipatSetup')) {
        card.setAttribute('onclick', orig + '; setTimeout(egipatSetup, 120);');
      }
    }

    showPage(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
