// ── МУЛЬТИЯЗЫЧНОСТЬ (i18n = "internationalization") ─────
//
// Как это работает:
// 1. Все тексты лежат в файлах src/locales/*.json (по одному на язык).
// 2. В HTML у элемента есть атрибут с «ключом», например:
//      <h3 data-i18n="services.debt.title">...</h3>
// 3. При смене языка мы находим перевод по ключу и вставляем его.
//
// Атрибуты:
//   data-i18n="ключ"            → заменяет текст элемента
//   data-i18n-html="ключ"       → заменяет HTML (когда в переводе есть <br>, <em>, <strong>)
//   data-i18n-attr="атрибут:ключ" → переводит атрибут (например, aria-label или content)

import fr from '../locales/fr.json';
import de from '../locales/de.json';
import en from '../locales/en.json';
import uk from '../locales/uk.json';

const translations = { fr, de, en, uk };
const DEFAULT_LANG = 'fr';
const STORAGE_KEY = 'docuswiss-lang';

/**
 * Достаёт значение из вложенного объекта по строке вида "services.debt.title".
 * Пример: getByPath({ a: { b: 'Привет' } }, 'a.b') → 'Привет'
 */
function getByPath(object, path) {
  return path.split('.').reduce((current, key) => current?.[key], object);
}

/**
 * Определяем, какой язык показать при первом открытии сайта.
 * Приоритет: ссылка (?lang=de) → выбор, сохранённый ранее → язык браузера → французский.
 */
function detectLanguage() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl && translations[fromUrl]) return fromUrl;

  // localStorage может быть недоступен (например, в приватном режиме), поэтому try/catch
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch {
    // ничего страшного — просто идём дальше
  }

  // navigator.language выглядит как "de-CH" — берём первые две буквы
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  if (translations[browserLang]) return browserLang;

  return DEFAULT_LANG;
}

/**
 * Переводит всю страницу на выбранный язык.
 */
export function setLanguage(lang) {
  const dictionary = translations[lang] ?? translations[DEFAULT_LANG];

  // 1. Обычный текст
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = getByPath(dictionary, element.dataset.i18n);
    if (value !== undefined) element.textContent = value;
  });

  // 2. Текст с HTML-тегами (переводы пишем мы сами, поэтому innerHTML здесь безопасен)
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const value = getByPath(dictionary, element.dataset.i18nHtml);
    if (value !== undefined) element.innerHTML = value;
  });

  // 3. Атрибуты. Формат: "имя-атрибута:ключ"
  document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
    const [attribute, key] = element.dataset.i18nAttr.split(':');
    const value = getByPath(dictionary, key);
    if (value !== undefined) element.setAttribute(attribute, value);
  });

  // 4. Язык документа — важно для поисковиков и программ чтения с экрана
  document.documentElement.lang = lang;

  // 5. Подсвечиваем активную кнопку языка
  document.querySelectorAll('[data-lang]').forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  // 6. Запоминаем выбор пользователя
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // не получилось сохранить — не критично
  }
}

/**
 * Запуск: определяем язык и вешаем обработчики на кнопки.
 */
export function initI18n() {
  setLanguage(detectLanguage());

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
}
