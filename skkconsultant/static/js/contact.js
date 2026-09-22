/* ==========================================================================
   SKK CONSULTANTS — contact.js
   Front-end validation only. This is a static site: nothing is transmitted.
   ========================================================================== */
(function () {
  'use strict';

  var $ = window.SKK.$;
  var $$ = window.SKK.$$;

  var form = $('[data-contact-form]');
  if (!form) { return; }

  var status = $('[data-form-status]');
  var statusText = $('[data-form-status-text]');

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^[+()\d\s-]{7,20}$/;

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, message) {
    var field = fieldOf(input);
    if (!field) { return; }
    var slot = $('.error', field);
    field.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (slot) { slot.textContent = message || ''; }
  }

  function validate(input) {
    var value = (input.value || '').trim();
    var label = input.getAttribute('data-label') || 'This field';

    if (input.required && !value) {
      setError(input, label + ' is required.');
      return false;
    }

    if (value && input.type === 'email' && !EMAIL.test(value)) {
      setError(input, 'Enter an email address in the format name@company.com.');
      return false;
    }

    if (value && input.type === 'tel' && !PHONE.test(value)) {
      setError(input, 'Enter a phone number using digits, spaces, + or -.');
      return false;
    }

    if (value && input.name === 'message' && value.length < 20) {
      setError(input, 'Add a little more detail — at least 20 characters.');
      return false;
    }

    setError(input, '');
    return true;
  }

  var inputs = $$('input, select, textarea', form).filter(function (el) {
    return el.type !== 'submit' && el.type !== 'hidden';
  });

  /* Validate on blur, then live-correct once a field has been flagged */
  inputs.forEach(function (input) {
    input.addEventListener('blur', function () { validate(input); });
    input.addEventListener('input', function () {
      var field = fieldOf(input);
      if (field && field.classList.contains('is-invalid')) { validate(input); }
    });
  });

  function showStatus(kind, message) {
    if (!status || !statusText) { return; }
    statusText.innerHTML = message;
    status.classList.add('is-shown');
    status.setAttribute('data-kind', kind);
    status.scrollIntoView({
      block: 'nearest',
      behavior: window.SKK.prefersReducedMotion() ? 'auto' : 'smooth'
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstBad = null;
    inputs.forEach(function (input) {
      if (!validate(input) && !firstBad) { firstBad = input; }
    });

    if (firstBad) {
      showStatus('error',
        '<b>Check the highlighted fields.</b>' +
        'A few details are missing or need correcting before this enquiry can be sent.');
      firstBad.focus();
      return;
    }

    var name = (form.elements.fullname.value || '').trim().split(' ')[0];
    var service = form.elements.service.value || 'your project';

    showStatus('success',
      '<b>Thanks, ' + name + ' — your enquiry is ready to send.</b>' +
      'This is a demonstration build with no server attached, so nothing has been transmitted. ' +
      'Connect the form to an email service or endpoint to start receiving ' + service.toLowerCase() +
      ' enquiries.');

    form.reset();
    inputs.forEach(function (input) { setError(input, ''); });
  });
}());
