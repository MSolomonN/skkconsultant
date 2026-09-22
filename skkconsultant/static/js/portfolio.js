/* ==========================================================================
   SKK CONSULTANTS — portfolio.js
   Category filtering, the full-screen lightbox, and the before/after sliders.
   ========================================================================== */
(function () {
  'use strict';

  var $ = window.SKK.$;
  var $$ = window.SKK.$$;

  var gallery = $('[data-gallery]');
  var shots = gallery ? $$('.shot', gallery) : [];

  function visibleShots() {
    return shots.filter(function (s) { return !s.hidden; });
  }

  /* Filtering is handled server-side via category links (see landing/views.py). */

  /* ==========================================================================
     2. LIGHTBOX
     ========================================================================== */
  var box = $('[data-lightbox]');

  if (box && shots.length) {
    var boxImg = $('[data-lb-img]', box);
    var boxCat = $('[data-lb-cat]', box);
    var boxTitle = $('[data-lb-title]', box);
    var boxDesc = $('[data-lb-desc]', box);
    var boxIndex = $('[data-lb-index]', box);
    var closeBtn = $('[data-lb-close]', box);
    var prevBtn = $('[data-lb-prev]', box);
    var nextBtn = $('[data-lb-next]', box);

    var pool = [];
    var pos = 0;
    var opener = null;

    function paint() {
      var shot = pool[pos];
      if (!shot) { return; }
      var img = $('img', shot);

      boxImg.src = shot.getAttribute('data-full') || img.currentSrc || img.src;
      boxImg.alt = img.getAttribute('alt') || '';
      boxCat.textContent = shot.getAttribute('data-cat-label') || '';
      boxTitle.textContent = shot.getAttribute('data-title') || '';
      boxDesc.textContent = shot.getAttribute('data-desc') || '';
      boxIndex.textContent = (pos + 1) + ' / ' + pool.length;
    }

    function open(shot) {
      pool = visibleShots();
      pos = pool.indexOf(shot);
      if (pos < 0) { pos = 0; }
      opener = shot;

      paint();
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    }

    function close() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      boxImg.removeAttribute('src');
      if (opener) { opener.focus(); }
    }

    function step(delta) {
      if (!pool.length) { return; }
      pos = (pos + delta + pool.length) % pool.length;
      paint();
    }

    shots.forEach(function (shot) {
      shot.addEventListener('click', function () { open(shot); });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });

    /* Click the backdrop, but not the image or the meta strip */
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__stage')) { close(); }
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'Tab') {
        /* Keep focus inside the dialog */
        var items = [closeBtn, prevBtn, nextBtn];
        var i = items.indexOf(document.activeElement);
        e.preventDefault();
        var nextI = e.shiftKey ? (i - 1 + items.length) % items.length : (i + 1) % items.length;
        items[nextI < 0 ? 0 : nextI].focus();
      }
    });

    /* Swipe between images on touch */
    var sx = 0;
    box.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 55) { step(dx < 0 ? 1 : -1); }
    }, { passive: true });
  }

  /* ==========================================================================
     3. BEFORE / AFTER SLIDERS
     Driven by a real range input so it works with keyboard and assistive
     technology for free; the visible handle just follows its value.
     ========================================================================== */
  $$('[data-ba]').forEach(function (ba) {
    var range = $('.ba__range', ba);
    if (!range) { return; }

    function sync() {
      ba.style.setProperty('--pos', range.value + '%');
    }

    range.addEventListener('input', sync);
    sync();
  });
}());
