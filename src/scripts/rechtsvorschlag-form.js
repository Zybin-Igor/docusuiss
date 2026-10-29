// ── ФОРМА «ВОЗРАЖЕНИЕ ПРОТИВ ПЛАТЁЖНОГО ТРЕБОВАНИЯ» ─────
//
// Урок 1: читаем данные формы и показываем/прячем поле «частично». ✅
// Урок 2: расчёт 10-дневного срока и проверка полей. ✅
// Урок 3: текст письма на языке кантона.
// Урок 4: печать / сохранение в PDF.

import { t, formatDate } from './i18n.js';
import { parseDate, calculateDeadline, daysUntil, isInDebtCollectionHolidays } from './deadline.js';
import { validateForm, validateControl, enableLiveValidation } from './form-validation.js';

export function initRechtsvorschlagForm() {
  // Находим элементы на странице по data-js-атрибутам
  const form = document.querySelector('[data-js-rv-form]');
  if (!form) return; // на других страницах формы нет — просто выходим

  const partialField = form.querySelector('[data-js-partial-field]');
  const scopeRadios = form.querySelectorAll('input[name="scope"]');
  const deadlineBox = form.querySelector('[data-js-deadline]');

  // ── Урок 1 (ваш код): поле «частично» ──────────────────
  scopeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const isPartial = radio.value === 'partial';
      partialField.hidden = !isPartial;
      const contestedAmountInput = form.querySelector('input[name="contestedAmount"]') || form.contestedAmount;
      if (contestedAmountInput) {
        contestedAmountInput.required = isPartial;
      }
    });
  });

  // ── Урок 2: срок ───────────────────────────────────────
  /**
   * Показываем блок со сроком под датой получения.
   * Вызывается при изменении даты и при смене языка.
   */
  function renderDeadline() {
    const receivedDate = parseDate(form.receivedDate.value);

    // Даты нет — прячем блок
    if (!receivedDate) {
      deadlineBox.hidden = true;
      return;
    }

    // Дата из будущего — это ошибка ввода, блок не показываем
    if (daysUntil(receivedDate) > 0) {
      deadlineBox.hidden = true;
      return;
    }

    const deadline = calculateDeadline(receivedDate);
    const daysLeft = daysUntil(deadline);

    // Выбираем состояние: обычное / срочно / последний день / срок прошёл
    let state = 'ok';
    let statusText = t('rv.deadline.daysLeft', { days: daysLeft });

    if (daysLeft < 0) {
      state = 'expired';
      statusText = t('rv.deadline.expired');
    } else if (daysLeft === 0) {
      state = 'urgent';
      statusText = t('rv.deadline.today');
    } else if (daysLeft <= 2) {
      state = 'urgent';
    }

    // Собираем HTML блока. Все тексты — из переводов.
    let html = `
      <p class="deadline__label">${t('rv.deadline.lastDay')}</p>
      <p class="deadline__date">${formatDate(deadline)}</p>
      <p class="deadline__status">${statusText}</p>
    `;

    if (state === 'expired') {
      html += `<p class="deadline__note">${t('rv.deadline.expiredHelp')}</p>`;
    } else {
      html += `<p class="deadline__note">${t('rv.deadline.postHint')}</p>`;
    }

    if (isInDebtCollectionHolidays(deadline)) {
      html += `<p class="deadline__note">${t('rv.deadline.ferien')}</p>`;
    }

    html += `<p class="deadline__note deadline__note--muted">${t('rv.deadline.holidayNote')}</p>`;

    deadlineBox.innerHTML = html;
    deadlineBox.dataset.state = state; // для стилей: .deadline[data-state="urgent"]
    deadlineBox.hidden = false;
  }

  // ── Урок 2: дополнительные проверки ────────────────────
  // Встроенных правил браузера тут не хватает, поэтому добавляем свои.
  // setCustomValidity('ключ') — пометить поле ошибочным, setCustomValidity('') — снять ошибку.
  function checkCustomRules() {
    // 1. Дата получения не может быть в будущем
    const receivedDate = parseDate(form.receivedDate.value);
    const isFuture = receivedDate && daysUntil(receivedDate) > 0;
    form.receivedDate.setCustomValidity(isFuture ? 'rv.errors.dateFuture' : '');

    // 2. Оспариваемая сумма не может быть больше всей суммы долга
    const claim = Number(form.claimAmount.value);
    const contested = Number(form.contestedAmount.value);
    const tooBig = form.contestedAmount.value !== '' && claim > 0 && contested > claim;
    form.contestedAmount.setCustomValidity(tooBig ? 'rv.errors.contestedTooBig' : '');
  }

  form.receivedDate.addEventListener('change', () => {
    checkCustomRules();
    validateControl(form.receivedDate);
    renderDeadline();
  });

  // При смене языка — перерисовать срок на новом языке
  document.addEventListener('i18n:change', renderDeadline);

  // Свои правила пересчитываем при каждом вводе (до «живой» проверки ниже)
  form.addEventListener('input', checkCustomRules);
  enableLiveValidation(form);

  // ── Отправка формы ─────────────────────────────────────
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // не перезагружать страницу

    checkCustomRules();
    if (!validateForm(form)) return; // есть ошибки — дальше не идём

    // FormData собирает все поля формы по их атрибуту name
    const data = Object.fromEntries(new FormData(form));
    console.log('Данные формы:', data);
    // На уроке 3 здесь появится готовое письмо
  });
}
