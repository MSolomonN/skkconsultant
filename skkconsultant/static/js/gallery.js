/* ==========================================================================
   SKK CONSULTANTS — gallery.js
   The full-screen hero slider.

   Behaviour: auto-advance, prev/next arrows, clickable indicators, swipe on
   touch, arrow-key support when focused, pause on hover / focus / tab-hidden,
   and no motion at all when the visitor prefers reduced motion.
   ========================================================================== */
(function () {
  'use strict';

  var $ = window.SKK.$;
  var $$ = window.SKK.$$;

  var hero = $('[data-hero]');
  if (!hero) { return; }

  var slides = $$('.hero__slide', hero);
  if (slides.length < 2) { return; }

  var captions = $$('[data-hero-caption]', hero);
  var titles = $$('[data-hero-title]', hero);
  var subs = $$('[data-hero-sub]', hero);
  var dots = $$('.hero__dot', hero);
  var current = $('[data-hero-current]', hero);
  var total = $('[data-hero-total]', hero);
  var live = $('[data-hero-live]', hero);

  var DELAY = parseInt(hero.getAttribute('data-delay'), 10) || 6500;
  var reduced = window.SKK.prefersReducedMotion();

  var index = 0;
  var timer = null;
  var paused = false;

  hero.style.setProperty('--hero-delay', DELAY + 'ms');
  if (total) { total.textContent = pad(slides.length); }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function setActive(list, i) {
    list.forEach(function (el, n) {
      el.classList.toggle('is-active', n === i);
    });
  }

  function show(next) {
    index = (next + slides.length) % slides.length;

    setActive(slides, index);
    setActive(captions, index);
    setActive(titles, index);
    setActive(subs, index);

    dots.forEach(function (dot, n) {
      var on = n === index;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', on ? 'true' : 'false');
      dot.setAttribute('tabindex', on ? '0' : '-1');
    });

    /* Restart the progress animation on the newly active indicator */
    var active = dots[index];
    if (active && !reduced) {
      active.style.animation = 'none';
      /* force reflow so the animation restarts */
      void active.offsetWidth;
      active.style.animation = '';
    }

    if (current) { current.textContent = pad(index + 1); }
    if (live) {
      live.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length + ': ' +
        (titles[index] ? titles[index].textContent.trim() : '');
    }
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function start() {
    if (reduced || paused) { return; }
    stop();
    timer = window.setInterval(next, DELAY);
  }

  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  function setPaused(state) {
    paused = state;
    hero.classList.toggle('is-paused', state);
    if (state) { stop(); } else { start(); }
  }

  /* ---------------------------------------------------------------- Controls */
  var nextBtn = $('[data-hero-next]', hero);
  var prevBtn = $('[data-hero-prev]', hero);

  if (nextBtn) {
    nextBtn.addEventListener('click', function () { next(); start(); });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', function () { prev(); start(); });
  }

  dots.forEach(function (dot, n) {
    dot.addEventListener('click', function () { show(n); start(); });
    dot.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); dots[index].focus(); start(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); dots[index].focus(); start(); }
    });
  });

  /* -------------------------------------------------------- Pause conditions */
  
  // Temporarily disabled pause feature, you can enable it in the future
  /*
  hero.addEventListener('mouseenter', function () { setPaused(true); });
  hero.addEventListener('mouseleave', function () { setPaused(false); });
  hero.addEventListener('focusin', function () { setPaused(true); });
  hero.addEventListener('focusout', function (e) {
    if (!hero.contains(e.relatedTarget)) { setPaused(false); }
  });
  */

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else if (!paused) { start(); }
  });

  /* ------------------------------------------------------------------- Swipe */
  var startX = 0;
  var startY = 0;
  var tracking = false;

  hero.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
    stop();
  }, { passive: true });

  hero.addEventListener('touchend', function (e) {
    if (!tracking) { return; }
    tracking = false;

    var touch = e.changedTouches[0];
    var dx = touch.clientX - startX;
    var dy = touch.clientY - startY;

    /* Only treat it as a swipe if it's clearly horizontal */
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) { next(); } else { prev(); }
    }
    start();
  }, { passive: true });

  /* --------------------------------------------------------------- Kick off */
  show(0);
  start();
}());
