/* ==========================================================================
   SKK CONSULTANTS — common.js
   Loaded on every page. Small shared helpers plus header and back-to-top.
   ========================================================================== */
(function () {
  'use strict';

  /* Shared helpers, exposed on a single namespace so the other scripts
     don't each re-implement them. */
  window.SKK = {
    $: function (sel, root) { return (root || document).querySelector(sel); },
    $$: function (sel, root) {
      return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    },
    prefersReducedMotion: function () {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    /* Fires cb at most once per animation frame while an event storms. */
    onFrame: function (cb) {
      var ticking = false;
      return function () {
        if (ticking) { return; }
        ticking = true;
        window.requestAnimationFrame(function () {
          ticking = false;
          cb();
        });
      };
    }
  };

  var $ = window.SKK.$;

  /* ---------------------------------------------------------------- Header */
  var header = $('.site-header');
  var toTop = $('.to-top');

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) { header.classList.toggle('is-stuck', y > 40); }
    if (toTop) { toTop.classList.toggle('is-visible', y > 700); }
  }

  if (header || toTop) {
    window.addEventListener('scroll', window.SKK.onFrame(onScroll), { passive: true });
    onScroll();
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: window.SKK.prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------ Footer year */
  var year = $('[data-year]');
  if (year) { year.textContent = String(new Date().getFullYear()); }
}());
