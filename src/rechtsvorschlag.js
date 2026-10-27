// ── ТОЧКА ВХОДА СТРАНИЦЫ «RECHTSVORSCHLAG» ──────────────
// У каждой страницы свой входной файл. Общие модули (языки, шапка)
// подключаем так же, как на главной, и добавляем модуль этой страницы.

import './styles/main.scss';

import { initI18n } from './scripts/i18n.js';
import { initHeader } from './scripts/header.js';
import { initRechtsvorschlagForm } from './scripts/rechtsvorschlag-form.js';

initI18n();
initHeader();
initRechtsvorschlagForm();

const yearElement = document.querySelector('[data-js-year]');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
