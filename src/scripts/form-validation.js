// ── ПРОВЕРКА ПОЛЕЙ ФОРМЫ ────────────────────────────────
//
// Браузер умеет сам проверять поля (required, type="number", pattern…),
// но его сообщения всегда на языке системы и выглядят по-разному.
// Поэтому проверку делаем сами, а сообщения берём из наших переводов.
// Модуль универсальный — подойдёт для любой будущей формы на сайте.

import { t } from './i18n.js';

/**
 * Какая ошибка у поля? Возвращает ключ перевода или null, если ошибок нет.
 * control.validity — встроенный объект браузера с результатами проверки.
 */
function getErrorKey(control) {
  const { validity } = control;

  if (validity.valueMissing) return 'form.errors.required';
  if (validity.badInput || validity.rangeUnderflow || validity.stepMismatch) return 'form.errors.number';
  if (validity.patternMismatch) return control.dataset.errorKey ?? 'form.errors.pattern';
  if (validity.customError) return control.validationMessage; // ключ, заданный через setCustomValidity

  return null;
}

/** Показать ошибку под полем (или убрать её, если errorKey === null). */
export function setFieldError(control, errorKey) {
  const field = control.closest('.field');
  if (!field) return;

  let message = field.querySelector('.field__error');

  if (!errorKey) {
    control.classList.remove('is-invalid');
    control.removeAttribute('aria-invalid');
    message?.remove();
    return;
  }

  // Создаём <p class="field__error"> только один раз
  if (!message) {
    message = document.createElement('p');
    message.className = 'field__error';
    message.id = `${control.id}-error`;
    field.append(message);
  }

  message.textContent = t(errorKey);
  message.dataset.errorKey = errorKey; // запомним ключ, чтобы перевести при смене языка
  control.classList.add('is-invalid');
  control.setAttribute('aria-invalid', 'true');
  control.setAttribute('aria-describedby', message.id); // программы чтения с экрана прочитают ошибку
}

/** Проверить одно поле. Возвращает true, если всё хорошо. */
export function validateControl(control) {
  // Спрятанные поля (например, «частичная сумма» при полном возражении) не проверяем
  if (control.closest('[hidden]') || control.disabled) {
    setFieldError(control, null);
    return true;
  }

  const errorKey = getErrorKey(control);
  setFieldError(control, errorKey);
  return errorKey === null;
}

/**
 * Проверить всю форму. Возвращает true, если всё заполнено правильно.
 * Курсор ставим в первое поле с ошибкой — так удобнее пользователю.
 */
export function validateForm(form) {
  const controls = [...form.querySelectorAll('input, select, textarea')].filter(
    (control) => control.type !== 'radio' && control.type !== 'submit',
  );

  const invalid = controls.filter((control) => !validateControl(control));

  if (invalid.length > 0) {
    invalid[0].focus();
    return false;
  }
  return true;
}

/**
 * Включить «живую» проверку: как только пользователь исправляет поле с ошибкой,
 * ошибка исчезает. А при смене языка тексты ошибок переводятся.
 */
export function enableLiveValidation(form) {
  form.addEventListener('input', (event) => {
    if (event.target.classList.contains('is-invalid')) {
      validateControl(event.target);
    }
  });

  document.addEventListener('i18n:change', () => {
    form.querySelectorAll('.field__error').forEach((message) => {
      message.textContent = t(message.dataset.errorKey);
    });
  });
}
