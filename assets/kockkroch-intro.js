/**
 * KOCKKROCH (KOCX KROCH) — Pure Logo Intro Controller
 * Fearless from Origin • Built to Survive
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'kockkroch_intro_seen';
  const INTRO_DURATION_MS = 1800;

  function initKockkrochIntro() {
    const introEl = document.getElementById('kockkroch-intro');
    if (!introEl) return;

    // Skip in Shopify Theme Customizer editor view
    if (window.Shopify && window.Shopify.designMode) {
      introEl.classList.add('kockkroch-intro--hidden');
      return;
    }

    const frequency = introEl.getAttribute('data-frequency') || 'always';
    if (frequency === 'once' && sessionStorage.getItem(STORAGE_KEY)) {
      introEl.classList.add('kockkroch-intro--hidden');
      return;
    }

    document.body.classList.add('kockkroch-intro-active');
    let isExited = false;

    function completeIntro() {
      if (isExited) return;
      isExited = true;

      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {}

      introEl.classList.add('kockkroch-intro--exiting');
      document.body.classList.remove('kockkroch-intro-active');

      document.dispatchEvent(
        new CustomEvent('kockkroch:intro:complete', { bubbles: true })
      );

      setTimeout(function () {
        introEl.classList.add('kockkroch-intro--hidden');
      }, 750);
    }

    setTimeout(completeIntro, INTRO_DURATION_MS);

    function onKeyDown(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        completeIntro();
        window.removeEventListener('keydown', onKeyDown);
      }
    }
    window.addEventListener('keydown', onKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKockkrochIntro);
  } else {
    initKockkrochIntro();
  }
})();
