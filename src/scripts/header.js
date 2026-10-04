// ── ШАПКА: ТЕНЬ ПРИ ПРОКРУТКЕ И МОБИЛЬНОЕ МЕНЮ ──────────

export function initHeader() {
  const header = document.querySelector('[data-js-header]');
  const burger = document.querySelector('[data-js-burger]');
  const menu = document.querySelector('[data-js-menu]');

  if (!header || !burger || !menu) return;

  // 1. Тень у шапки, когда страница прокручена
  const updateShadow = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  updateShadow();
  window.addEventListener('scroll', updateShadow, { passive: true });

  // 2. Открытие и закрытие мобильного меню
  const setMenuOpen = (isOpen) => {
    burger.classList.toggle('is-active', isOpen);
    menu.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('is-lock', isOpen);
  };

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  // Клик по пункту меню — закрываем меню (переходим к разделу)
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Клавиша Escape тоже закрывает меню
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  // Если окно расширили до десктопа — сбрасываем состояние меню
  window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });
}
