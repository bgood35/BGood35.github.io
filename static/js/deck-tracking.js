(function () {
  if (typeof window === 'undefined') return;
  document.querySelectorAll('.deck-carousel').forEach(function (deck) {
    var deckName = (deck.id || 'deck').replace(/-deck$/, '').replace(/-/g, '_');
    var total = deck.querySelectorAll('.deck-carousel__slide').length;
    var seen = new Set();
    var started = false;

    function activeSlide() {
      var a = deck.querySelector('.deck-carousel__slide.is-active');
      return a ? Number(a.dataset.index) + 1 : null; // 1-based
    }
    function ga(name, params) {
      if (typeof gtag === 'function') gtag('event', name, params);
    }
    function fire(n) {
      if (n == null || seen.has(n)) return;
      seen.add(n);
      ga('deck_progress', { deck_name: deckName, slide_reached: n, slide_total: total });
      if (n === total) ga('deck_completed', { deck_name: deckName });
    }

    new IntersectionObserver(function (entries, io) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !started) {
          started = true;
          ga('deck_view', { deck_name: deckName });
          fire(activeSlide());
          io.disconnect();
        }
      });
    }, { threshold: 0.5 }).observe(deck);

    new MutationObserver(function () {
      if (started) fire(activeSlide());
    }).observe(deck, { subtree: true, attributes: true, attributeFilter: ['class'] });
  });
})();
