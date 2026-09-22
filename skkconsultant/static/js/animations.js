/* ==========================================================================
   SKK CONSULTANTS — animations.js
   One quiet reveal on scroll, plus counting statistics. Both bail out
   entirely when the visitor has asked for reduced motion.
   ========================================================================== */
(function () {
  'use strict';

  var $$ = window.SKK.$$;
  var reduced = window.SKK.prefersReducedMotion();

  /* ----------------------------------------------------------- Scroll reveal */
  var revealables = $$('.reveal');

  if (!revealables.length) {
    /* nothing to do */
  } else if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* --------------------------------------------------------------- Counters */
  var counters = $$('[data-count]');

  function render(el, value) {
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var shown = value >= 1000 ? Number(value).toLocaleString('en-US') : String(value);
    el.innerHTML = prefix + shown + (suffix ? '<span>' + suffix + '</span>' : '');
  }

  function run(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) { return; }

    if (reduced) {
      render(el, target);
      return;
    }

    var duration = 1400;
    var start = null;

    function step(now) {
      if (start === null) { start = now; }
      var progress = Math.min((now - start) / duration, 1);
      /* ease-out cubic so the number settles rather than snapping */
      var eased = 1 - Math.pow(1 - progress, 3);
      render(el, Math.round(target * eased));
      if (progress < 1) { window.requestAnimationFrame(step); }
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { render(el, parseFloat(el.getAttribute('data-count'))); });
    } else {
      var countObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          run(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.4 });

      counters.forEach(function (el) {
        render(el, 0);
        countObserver.observe(el);
      });
    }
  }
}());
