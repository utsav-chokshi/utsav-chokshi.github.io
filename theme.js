(() => {
  'use strict';
  const key = 'portfolio-theme';
  const system = window.matchMedia('(prefers-color-scheme: light)');
  const valid = value => value === 'light' || value === 'dark';
  let preference = null;
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch (_) { /* The toggle still works when browser storage is unavailable. */ }

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const next = theme === 'dark' ? 'light' : 'dark';
      button.querySelector('[data-theme-icon]').textContent = next === 'light' ? '☀' : '☾';
      button.querySelector('[data-theme-label]').textContent = next === 'light' ? 'Light' : 'Dark';
      button.setAttribute('aria-label', `Switch to ${next} theme`);
      button.title = `Switch to ${next} theme`;
      button.hidden = false;
    });
  }
  // Set colors before the stylesheet loads to avoid a flash of the wrong theme.
  apply(preference || (system.matches ? 'light' : 'dark'));
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(key, preference); } catch (_) { /* Keep this visit usable. */ }
        apply(preference);
      });
    });
  });
  system.addEventListener('change', () => {
    if (!preference) apply(system.matches ? 'light' : 'dark');
  });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : null;
    apply(preference || (system.matches ? 'light' : 'dark'));
  });
})();
