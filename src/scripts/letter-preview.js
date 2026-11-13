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
  const printButton = section.querySelector('[data-js-print-letter]');

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

  // ════════════════════════════════════════════════════════
  // 🏠 ДОМАШНЕЕ ЗАДАНИЕ (урок 6), часть A: параметр scroll
  //
  // Сейчас show() ВСЕГДА прокручивает страницу к письму. При нажатии кнопки
  // это правильно. Но при автообновлении (часть B, в rechtsvorschlag-form.js)
  // человек сидит в форме — страница не должна прыгать вниз.
  //
  // Подсказки:
  //  1. Добавьте функции второй параметр — объект с настройками
  //     и значением по умолчанию:
  //       function show({ data, lang, receivedDate, deadline }, { scroll = true } = {}) {
  //     • { scroll = true } — если scroll не передали, он будет true;
  //     • = {} в конце — если второй параметр не передали ВООБЩЕ,
  //       вместо него возьмётся пустой объект (иначе будет ошибка).
  //  2. Прокручивайте, только если scroll === true:
  //       if (scroll) { ...строка со scrollIntoView... }
  //
  // Пример вызова: show(письмо, { scroll: false }) — показать без прокрутки.
  // ════════════════════════════════════════════════════════

  /** Показать письмо. Вызывается из формы после успешной проверки. */
  function show({ data, lang, receivedDate, deadline }) {
    current = { lang, deadline, caseNumber: data.caseNumber.trim() };

    letter.innerHTML = buildRechtsvorschlagLetter(data, lang, receivedDate);
    letter.lang = lang; // язык письма — для правильных переносов и озвучки
    renderTexts();

    section.hidden = false;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Спрятать письмо (например, если в форме появилась ошибка). */
  function hide() {
    section.hidden = true;
  }

  /** Видно ли сейчас письмо на странице? */
  function isVisible() {
    return !section.hidden;
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
      console.error('Error while copying text: ', err);
    }
  });

  // ════════════════════════════════════════════════════════
  // 🏠 ДОМАШНЕЕ ЗАДАНИЕ (урок 4): кнопка «Печать / PDF»
  //
  // Все стили для печати уже готовы (файл src/styles/base/_print.scss).
  // Осталось открыть окно печати по клику на printButton.
  //
  // Подсказки:
  //  1. Повесьте обработчик клика на printButton (как вы делали с copyButton,
  //     но async здесь НЕ нужен).
  //  2. Окно печати открывает одна команда: window.print();
  //
  // Бонус ⭐: имя PDF-файла браузер берёт из заголовка страницы (document.title).
  // Сделайте, чтобы файл назывался, например, «Rechtsvorschlag 26-123456»:
  //   a) перед печатью запомните старый заголовок:  const oldTitle = document.title;
  //   b) поставьте новый:  document.title = `Rechtsvorschlag ${current.caseNumber}`;
  //   c) вызовите window.print();
  //   d) верните старый заголовок:  document.title = oldTitle;
  //
  // Пишите код ниже этой строки 👇

  // ════════════════════════════════════════════════════════
  if (printButton) {
    printButton.addEventListener('click', () => {
      //  Запоминаем текущий заголовок страницы
      const oldTitle = document.title;

      // Устанавливаем новое имя для будущего PDF-файла (если есть номер дела)
      if (current && current.caseNumber) {
        document.title = `Rechtsvorschlag ${current.caseNumber}`;
      }

      //  Открываем системное окно печати браузера
      window.print();

      //  Возвращаем старый заголовок страницы обратно
      document.title = oldTitle;
    });
  }
  return { show, hide, isVisible };
}
