// ── ПРЕДПРОСМОТР ГОТОВОГО ПИСЬМА ────────────────────────
//
// Показывает письмо, подсказку о языке и следующие шаги.
// Сам текст письма собирает letters/rechtsvorschlag-letter.js —
// здесь только работа со страницей.

import { t, formatDate } from './i18n.js';
import { buildRechtsvorschlagLetter } from './letters/rechtsvorschlag-letter.js';

export function initLetterPreview() {
  const section = document.querySelector('[data-js-letter-section]');
  const letter = section.querySelector('[data-js-letter]');
  const note = section.querySelector('[data-js-letter-note]');
  const nextSteps = section.querySelector('[data-js-next-steps]');
  const copyButton = section.querySelector('[data-js-copy-letter]');

  let current = null; // последние данные — чтобы перерисовать при смене языка сайта

  /** Тексты вокруг письма (на языке САЙТА, а не письма) */
  function renderTexts() {
    if (!current) return;

    note.textContent = t('rv.letter.langNote', { lang: t(`rv.langNames.${current.lang}`) });

    const deadline = formatDate(current.deadline);
    nextSteps.innerHTML = ['step1', 'step2', 'step3', 'step4']
      .map((step) => `<li>${t(`rv.letter.${step}`, { date: deadline })}</li>`)
      .join('');
  }

  /** Показать письмо. Вызывается из формы после успешной проверки. */
  function show({ data, lang, receivedDate, deadline }) {
    current = { lang, deadline };

    letter.innerHTML = buildRechtsvorschlagLetter(data, lang, receivedDate);
    letter.lang = lang; // язык письма — для правильных переносов и озвучки
    renderTexts();

    section.hidden = false;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('i18n:change', renderTexts);

  // ════════════════════════════════════════════════════════
  // 🏠 ДОМАШНЕЕ ЗАДАНИЕ (урок 3): кнопка «Скопировать текст»
  //
  // По клику на copyButton нужно скопировать текст письма в буфер обмена,
  // чтобы человек мог вставить его в Word или в e-mail.
  //
  // Подсказки:
  //  1. Повесьте обработчик: copyButton.addEventListener('click', async () => { ... })
  //     (слово async нужно, потому что копирование — «асинхронная» операция)
  //  2. Текст письма без HTML-тегов: letter.innerText
  //  3. Скопировать: await navigator.clipboard.writeText(текст);
  //  4. Покажите, что получилось: copyButton.textContent = t('rv.letter.copied');
  //
  // Бонус ⭐: через 2 секунды верните кнопке прежний текст:
  //   setTimeout(() => { copyButton.textContent = t('rv.letter.copy'); }, 2000);
  //
  // Пишите код ниже этой строки 👇

  // ════════════════════════════════════════════════════════
copyButton.addEventListener('click', async () => {
    try {
      
      const textToCopy = letter.innerText;//Извлекаем чистый текст письма без HTML-тегов

      
      await navigator.clipboard.writeText(textToCopy);//Копируем текст асинхронно в буфер обмена
      
      copyButton.textContent = t('rv.letter.copied');//Меняем текст кнопки на «Скопировано»
// Возврат исходного текста кнопки через 2 секунды
      setTimeout(() => {
        copyButton.textContent = t('rv.letter.copy');
      }, 2000);
    } catch (err) {
      console.error('Ошибка при копировании текста: ', err);
    }
  });
  return { show };
}
