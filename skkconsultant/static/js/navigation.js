/* ==========================================================================
   SKK CONSULTANTS — navigation.js
   Mobile drawer, focus trapping while open, active link marking.
   ========================================================================== */
(function () {
  'use strict';

  var $ = window.SKK.$;
  var $$ = window.SKK.$$;

  var toggle = $('.nav-toggle');
  var nav = $('#primary-nav');
  var body = document.body;

  /* ------------------------------------------------------------ Active link */
  (function markActive() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) { return; }
      if (href === path || (path === 'index.html' && href === 'index.html')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }());

  if (!toggle || !nav) { return; }

  var lastFocused = null;

  function focusables() {
    return $$('a[href], button:not([disabled])', nav).filter(function (el) {
      return el.offsetParent !== null;
    });
  }

  function openNav() {
    lastFocused = document.activeElement;
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    body.classList.add('is-locked');
    var first = focusables()[0];
    if (first) { first.focus(); }
  }

  function closeNav(returnFocus) {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    body.classList.remove('is-locked');
    if (returnFocus && lastFocused) { lastFocused.focus(); }
  }

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) { closeNav(true); } else { openNav(); }
  });

  /* Close when a destination is chosen */
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { closeNav(false); }
  });

  document.addEventListener('keydown', function (e) {
    if (toggle.getAttribute('aria-expanded') !== 'true') { return; }

    if (e.key === 'Escape') {
      closeNav(true);
      return;
    }

    if (e.key !== 'Tab') { return; }

    var items = focusables();
    if (!items.length) { return; }
    var first = items[0];
    var last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* Reset state if the viewport grows past the mobile breakpoint */
  var wide = window.matchMedia('(min-width: 961px)');
  function onBreakpoint(e) {
    if (e.matches) { closeNav(false); }
  }
  if (wide.addEventListener) {
    wide.addEventListener('change', onBreakpoint);
  } else if (wide.addListener) {
    wide.addListener(onBreakpoint);
  }
}());
