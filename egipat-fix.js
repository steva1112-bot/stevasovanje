žščžžžž(function() {
  function init() {
    var container = document.getElementById('egipat-pages');
    var counter = document.getElementById('egipat-counter');
    var prevBtn = document.getElementById('egipat-prev');
    var nextBtn = document.getElementById('egipat-next');
    if (!container) return;

    var slides = container.querySelectorAll('.book-page-slide');
    var total = slides.length;
    var current = 0;

    // Remove active class from all - navigation via translateX
    slides.forEach(function(s) { s.classList.remove('active'); });

    // Set flex layout identical to amsterdam
    container.style.transition = 'transform 0.4s ease';

    function show(n) {
      container.style.transform = 'translateX(-' + (n * 100) + '%)';
      current = n;
      if (counter) counter.textContent = (n + 1) + ' / ' + total;
      if (prevBtn) prevBtn.disabled = (n === 0);
      if (nextBtn) nextBtn.disabled = (n >= total - 1);
    }

    window.egipatCurrentPage = 0;
    window.egipatNext = function() { if (current < total - 1) show(current + 1); };
    window.egipatPrev = function() { if (current > 0) show(current - 1); };
    window.egipatSetup = function() { show(0); };

    // Patch egipat card onclick
    var card = document.querySelector('[onclick*="openPage(\'egipat\')"]');
    if (card) {
      var orig = card.getAttribute('onclick');
      if (orig && !orig.includes('egipatSetup')) {
        card.setAttribute('onclick', orig + '; setTimeout(egipatSetup, 120);');
      }
    }

    show(0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
