/**
 * KOCKKROCH (KOCX KROCH) — Pure Logo Intro Controller
 * Fearless from Origin • Built to Survive
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'kockkroch_intro_seen';
  const INTRO_DURATION_MS = 1900; // Optimal timing for emblem stroke draw + shard ignition

  function initKockkrochIntro() {
    const introEl = document.getElementById('kockkroch-intro');
    if (!introEl) return;

    const frequency = introEl.getAttribute('data-frequency') || 'always';

    // If configured for 'once' per session and already seen
    if (frequency === 'once' && sessionStorage.getItem(STORAGE_KEY)) {
      introEl.classList.add('kockkroch-intro--hidden');
      return;
    }

    // Lock scroll while intro plays
    document.body.classList.add('kockkroch-intro-active');

    let isExited = false;

    function completeIntro() {
      if (isExited) return;
      isExited = true;

      // Mark as seen for session
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        // Storage might be disabled
      }

      // Add exiting class for dual shutter split animation
      introEl.classList.add('kockkroch-intro--exiting');

      // Unlock scroll
      document.body.classList.remove('kockkroch-intro-active');

      // Notify other components (hero sliders, marquees)
      document.dispatchEvent(
        new CustomEvent('kockkroch:intro:complete', { bubbles: true })
      );

      // Clean up DOM after shutter animation finishes
      setTimeout(function () {
        introEl.classList.add('kockkroch-intro--hidden');
      }, 750);
    }

    // Auto-complete after animation finishes
    const autoExitTimer = setTimeout(completeIntro, INTRO_DURATION_MS);

    // Skip button click
    const skipBtn = document.getElementById('kockkroch-intro-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clearTimeout(autoExitTimer);
        completeIntro();
      });
    }

    // Keyboard ESC shortcut
    function onKeyDown(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        clearTimeout(autoExitTimer);
        completeIntro();
        window.removeEventListener('keydown', onKeyDown);
      }
    }
    window.addEventListener('keydown', onKeyDown);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKockkrochIntro);
  } else {
    initKockkrochIntro();
  }
})();
