// ── АККОРДЕОН «ЧАСТЫЕ ВОПРОСЫ» ──────────────────────────
//
// Используем «делегирование событий»: один обработчик на весь список
// вместо отдельного обработчика на каждый вопрос.

export function initFaq() {
  const faq = document.querySelector('[data-js-faq]');
  if (!faq) return;

  faq.addEventListener('click', (event) => {
    // Ищем кнопку-вопрос, по которой кликнули (или внутри которой кликнули)
    const question = event.target.closest('.faq__question');
    if (!question) return;

    const item = question.closest('.faq__item');
    const wasOpen = item.classList.contains('is-open');

    // Закрываем все вопросы...
    faq.querySelectorAll('.faq__item').forEach((otherItem) => {
      otherItem.classList.remove('is-open');
      otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    // ...и открываем выбранный, если он был закрыт
    if (!wasOpen) {
      item.classList.add('is-open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
}
