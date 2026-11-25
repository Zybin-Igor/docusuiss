// ── ТОЧКА ВХОДА СТРАНИЦЫ «EINSPRACHE» ──────────────
// У каждой страницы свой входной файл. Общие модули (языки, шапка)
// подключаем так же, как на главной, и добавляем модуль этой страницы.

import './fonts.js';
import './styles/main.scss';

import { initI18n } from './scripts/i18n.js';
import { initHeader } from './scripts/header.js';
import { initEinspracheForm } from './scripts/einsprache-form.js';

initI18n();
initHeader();
initEinspracheForm();

const yearElement = document.querySelector('[data-js-year]');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
