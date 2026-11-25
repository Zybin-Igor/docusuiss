// ── ОБЩИЕ ФУНКЦИИ ДЛЯ ВСЕХ ПИСЕМ ────────────────────────
//
// Раньше эти три функции жили в rechtsvorschlag-letter.js.
// Когда появилось второе письмо (Einsprache), мы вынесли их сюда,
// чтобы не копировать один и тот же код в каждый файл.
// Правило программистов: «Don't Repeat Yourself» — не повторяйся.

import { escapeHtml } from '../utils.js';

/** Дата прописью на языке письма: «29. Oktober 2026», «29 octobre 2026» */
export function formatLetterDate(date, locale) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

/** Подставляет значения в шаблон: fill('Nr. {caseNumber}', { caseNumber: '123' }) → 'Nr. 123' */
export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}

/** Многострочный текст (адрес) → строки, разделённые <br> */
export function lines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(escapeHtml)
    .join('<br />');
}
