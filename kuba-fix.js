/* kuba-fix.js v1 - Fix za navigaciju knjige: sledeća/prethodna strana */
(function() {
    function fixKubaNav() {
          var slides = document.querySelectorAll('#kuba-pages .book-page-slide');
          if (!slides || slides.length === 0) return;

      function showSpread(dir) {
              var sl = Array.from(slides);
              var activeIdx = sl.findIndex(function(s) { return s.classList.contains('active'); });
              if (activeIdx < 0) activeIdx = 0;

            // Pomeri za 2 (jedan spread = leva + desna strana)
            var newActive = activeIdx + dir * 2;
              if (newActive < 0) newActive = 0;
              if (newActive >= sl.length) return;

            sl.forEach(function(s) {
                      s.classList.remove('active', 'right-visible');
            });
              sl[newActive].classList.add('active');
              if (newActive + 1 < sl.length) {
                        sl[newActive + 1].classList.add('right-visible');
              }

            // Azuriraj counter
            var spreadNum = Math.floor(newActive / 2) + 1;
              var totalSpreads = Math.ceil(sl.length / 2);
              var co = document.getElementById('kuba-counter-outer');
              if (co) co.textContent = spreadNum + ' / ' + totalSpreads;
              var ci = document.getElementById('kuba-counter');
              if (ci) ci.textContent = spreadNum + ' / ' + totalSpreads;

            if (window.kubaBookPage !== undefined) window.kubaBookPage = newActive;
      }

      window.kubaNext = function() { showSpread(1); };
          window.kubaPrev = function() { showSpread(-1); };
    }

   // Pokusaj odmah, zatim cekaj da se Kuba page ucita
   if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', fixKubaNav);
   } else {
         fixKubaNav();
   }

   // Takodje override kada se Kuba page otvori
   var obs = new MutationObserver(function() {
         var kubaPg = document.getElementById('page-kuba');
         if (kubaPg && kubaPg.classList.contains('active')) {
                 fixKubaNav();
         }
   });
    obs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
})();
