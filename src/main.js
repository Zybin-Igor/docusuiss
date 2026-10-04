// ── ТОЧКА ВХОДА ─────────────────────────────────────────
// Vite начинает сборку с этого файла.
// Здесь мы подключаем стили и запускаем все модули сайта.

import './styles/main.scss';

import { initI18n } from './scripts/i18n.js';
import { initHeader } from './scripts/header.js';
import { initFaq } from './scripts/faq.js';

initI18n();
initHeader();
initFaq();

// Текущий год в подвале — чтобы не менять его вручную каждый январь
const yearElement = document.querySelector('[data-js-year]');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
