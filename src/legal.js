// ── ТОЧКА ВХОДА СТРАНИЦЫ «IMPRESSUM И DATENSCHUTZ» ──────
// Своих скриптов у страницы нет: только общие модули (шрифты, стили, языки, шапка).

import './fonts.js';
import './styles/main.scss';

import { initI18n } from './scripts/i18n.js';
import { initHeader } from './scripts/header.js';

initI18n();
initHeader();

const yearElement = document.querySelector('[data-js-year]');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
