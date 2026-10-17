(() => {
  'use strict';
  const key = 'joyofphonetics-theme-v1';
  const valid = value => value === 'poster' || value === 'book';
  let saved;
  try { saved = localStorage.getItem(key); } catch (_) { /* Private/blocked storage is optional. */ }
  const requested = new URLSearchParams(location.search).get('theme');
  let theme = valid(requested) ? requested : valid(saved) ? saved : 'poster';
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'book' ? '#8e94cc' : '#f7efdf';
    document.querySelectorAll('[data-theme-art]').forEach(image => {
      image.src = theme === 'book' ? image.dataset.artBook : image.dataset.artCream;
    });
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    });
  }
  // Runs before styles paint. This setting never reads or rewrites the lab's data key.
  applyTheme();
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.addEventListener('click', () => {
        theme = button.dataset.themeChoice;
        applyTheme();
        try { localStorage.setItem(key, theme); } catch (_) { /* Keep working without persistence. */ }
      });
    });
    function showLesson(name, focus = false) {
      document.querySelectorAll('[data-lesson]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.lesson === name));
      });
      document.querySelectorAll('[data-lesson-panel]').forEach(panel => {
        panel.hidden = panel.dataset.lessonPanel !== name;
        if (!panel.hidden && focus) panel.querySelector('h3')?.focus();
      });
    }
    showLesson('listen');
    document.querySelectorAll('[data-lesson]').forEach(button => {
      button.addEventListener('click', () => showLesson(button.dataset.lesson, true));
    });
  });
})();
