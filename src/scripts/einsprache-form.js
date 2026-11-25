// ── ФОРМА «ВОЗРАЖЕНИЕ ПРОТИВ ШТРАФНОГО ПРИКАЗА» (Einsprache) ──
//
// Второй документ сайта. Устроен так же, как Rechtsvorschlag,
// и переиспользует общие модули: сроки, проверку полей, языки кантонов,
// предпросмотр письма. Новое здесь:
//  • дата самого приказа (orderDate);
//  • фикция вручения: если письмо забрали на почте по извещению,
//    срок может начаться раньше (ст. 85 абз. 4 лит. a StPO) — см. deadline.js;
//  • по желанию — просьба об ознакомлении с делом.

import { t, formatDate } from './i18n.js';
import { parseDate, addDays, calculateDeadline, daysUntil, getNotificationDate } from './deadline.js';
import { validateForm, validateControl, enableLiveValidation } from './form-validation.js';
import { getLetterLanguages } from './cantons.js';
import { initLetterPreview } from './letter-preview.js';
import { buildEinspracheLetter } from './letters/einsprache-letter.js';

export function initEinspracheForm() {
  const form = document.querySelector('[data-js-es-form]');
  if (!form) return;

  const deadlineBox = form.querySelector('[data-js-deadline]');
  const letterLangField = form.querySelector('[data-js-letter-lang-field]');
  const noticeField = form.querySelector('[data-js-notice-field]');
  const receivedField = form.querySelector('[data-js-received-field]');

  // Тот же предпросмотр, что у Rechtsvorschlag, но со своим письмом и текстами
  const letterPreview = initLetterPreview({
    buildLetter: buildEinspracheLetter,
    pdfName: 'Einsprache',
    i18nPrefix: 'es',
  });

  // ── Как получен приказ ─────────────────────────────────
  // Три варианта (радиокнопки name="delivery"):
  //   'hand'   — вручили лично / в почтовый ящик → считаем от даты получения;
  //   'pickup' — забрал(а) на почте по извещению → ваша getNotificationDate
  //              выбирает более раннюю дату (ст. 85 абз. 4 лит. a StPO);
  //   'notYet' — извещение есть, но письмо ещё не забрали → считаем от «извещение + 7».

  /** Какой вариант сейчас выбран: 'hand' | 'pickup' | 'notYet' */
  function getDelivery() {
    return form.delivery.value; // у группы радиокнопок .value — значение отмеченной
  }

  /** Показываем только нужные поля и делаем их обязательными. */
  function updateDeliveryFields() {
    const delivery = getDelivery();
    const needsNotice = delivery !== 'hand';
    const needsReceived = delivery !== 'notYet';

    noticeField.hidden = !needsNotice;
    form.noticeDate.required = needsNotice;

    receivedField.hidden = !needsReceived;
    form.receivedDate.required = needsReceived;
  }

  /**
   * С какой даты считается срок. Возвращает null, если нужных дат ещё нет.
   * Здесь вся «логика выбора», а расчёт делают чистые функции из deadline.js.
   */
  function getStartDate() {
    const delivery = getDelivery();
    const receivedDate = parseDate(form.receivedDate.value);
    const noticeDate = parseDate(form.noticeDate.value);

    if (delivery === 'hand') return receivedDate;
    if (delivery === 'notYet') return noticeDate ? addDays(noticeDate, 7) : null;

    // 'pickup': нужны обе даты — тогда ваша функция выберет более раннюю
    if (!receivedDate || !noticeDate) return null;
    return getNotificationDate(receivedDate, noticeDate);
  }

  form.querySelectorAll('input[name="delivery"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      updateDeliveryFields();
      checkCustomRules();
      renderDeadline();
    });
  });

  // ── Блок со сроком ─────────────────────────────────────
  function renderDeadline() {
    const delivery = getDelivery();
    const receivedDate = parseDate(form.receivedDate.value);
    const startDate = getStartDate();

    // Нет нужных дат или дата получения из будущего — блок не показываем
    if (!startDate || (receivedDate && delivery !== 'notYet' && daysUntil(receivedDate) > 0)) {
      deadlineBox.hidden = true;
      return;
    }

    const deadline = calculateDeadline(startDate);
    const daysLeft = daysUntil(deadline);

    let state = 'ok';
    let statusText = t('rv.deadline.daysLeft', { days: daysLeft });

    if (daysLeft < 0) {
      state = 'expired';
      statusText = t('rv.deadline.expired');
    } else if (daysLeft === 0) {
      state = 'urgent';
      statusText = t('rv.deadline.today');
    } else if (daysLeft <= 2 || delivery === 'notYet') {
      state = 'urgent'; // письмо ещё не забрано — это всегда срочно
    }

    let html = `
      <p class="deadline__label">${t('es.deadline.lastDay')}</p>
      <p class="deadline__date">${formatDate(deadline)}</p>
      <p class="deadline__status">${statusText}</p>
    `;

    // Объясняем, откуда взялась дата начала срока
    if (delivery === 'notYet') {
      html += `<p class="deadline__note">${t('es.deadline.notYet', { date: formatDate(startDate) })}</p>`;
    } else if (delivery === 'pickup' && startDate.getTime() !== receivedDate.getTime()) {
      html += `<p class="deadline__note">${t('es.deadline.fiction', { date: formatDate(startDate) })}</p>`;
    }

    if (delivery !== 'hand') {
      html += `<p class="deadline__note">${t('es.deadline.fictionCondition')}</p>`;
    }

    html += `<p class="deadline__note">${t(state === 'expired' ? 'es.deadline.expiredHelp' : 'es.deadline.postHint')}</p>`;
    html += `<p class="deadline__note deadline__note--muted">${t('rv.deadline.holidayNote')}</p>`;

    deadlineBox.innerHTML = html;
    deadlineBox.dataset.state = state;
    deadlineBox.hidden = false;
  }

  // ── Свои правила проверки ──────────────────────────────
  function checkCustomRules() {
    const receivedDate = parseDate(form.receivedDate.value);
    const orderDate = parseDate(form.orderDate.value);
    const noticeDate = parseDate(form.noticeDate.value);

    // 1. Дата получения не в будущем
    const isFuture = receivedDate && daysUntil(receivedDate) > 0;
    form.receivedDate.setCustomValidity(isFuture ? 'rv.errors.dateFuture' : '');

    // 2. Приказ не может быть вынесен позже, чем его получили
    const orderAfterReceipt = orderDate && receivedDate && orderDate > receivedDate;
    form.orderDate.setCustomValidity(orderAfterReceipt ? 'es.errors.orderAfterReceipt' : '');

    // 3. Извещение приходит раньше, чем письмо забирают (или в тот же день)
    const delivery = getDelivery();
    const noticeAfterReceipt = delivery === 'pickup' && noticeDate && receivedDate && noticeDate > receivedDate;
    // 4. Извещение не может быть из будущего
    const noticeFuture = delivery !== 'hand' && noticeDate && daysUntil(noticeDate) > 0;
    let noticeError = '';
    if (noticeFuture) noticeError = 'es.errors.noticeFuture';
    else if (noticeAfterReceipt) noticeError = 'es.errors.noticeAfterReceipt';
    form.noticeDate.setCustomValidity(noticeError);
  }

  ['receivedDate', 'noticeDate', 'orderDate'].forEach((name) => {
    form[name].addEventListener('change', () => {
      checkCustomRules();
      validateControl(form[name]);
      renderDeadline();
    });
  });

  document.addEventListener('i18n:change', renderDeadline);

  form.addEventListener('input', checkCustomRules);
  enableLiveValidation(form);

  // ── Язык письма (как в Rechtsvorschlag) ────────────────
  function updateLetterLanguages() {
    const languages = getLetterLanguages(form.canton.value);
    const previous = form.letterLang.value;

    form.letterLang.innerHTML = '';
    languages.forEach((lang) => form.letterLang.add(new Option(t(`rv.langNames.${lang}`), lang)));

    if (languages.includes(previous)) form.letterLang.value = previous;
    letterLangField.hidden = languages.length < 2;
  }

  form.canton.addEventListener('change', updateLetterLanguages);
  document.addEventListener('i18n:change', updateLetterLanguages);

  // ── Письмо ─────────────────────────────────────────────
  function showLetter(options) {
    const data = Object.fromEntries(new FormData(form));
    const startDate = getStartDate();

    letterPreview.show(
      {
        data,
        lang: data.letterLang || getLetterLanguages(data.canton)[0],
        receivedDate: parseDate(data.receivedDate),
        deadline: calculateDeadline(startDate),
      },
      options,
    );
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Письмо ещё не забрано: без него нельзя узнать номер дела и дату приказа
    if (getDelivery() === 'notYet') {
      deadlineBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    checkCustomRules();
    if (!validateForm(form)) return;
    showLetter();
  });

  // Автообновление письма (как вы сделали в уроке 6)
  form.addEventListener('change', () => {
    if (!letterPreview.isVisible()) return;
    checkCustomRules();
    if (!form.checkValidity()) {
      letterPreview.hide();
      return;
    }
    showLetter({ scroll: false });
  });

  updateDeliveryFields(); // начальное состояние полей
}
