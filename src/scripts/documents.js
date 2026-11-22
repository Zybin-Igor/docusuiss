// ── СПИСОК ДОКУМЕНТОВ НА ГЛАВНОЙ ────────────────────────
//
// Урок 7: карточки документов строим из ДАННЫХ, а не пишем руками в HTML.
//
// Зачем: сейчас в index.html шесть почти одинаковых карточек (70 строк),
// и у всех написано «В подготовке» — даже у готового Rechtsvorschlag.
// Когда карточки строятся из массива, новый документ — это ОДНА строка
// в списке DOCUMENTS, а статус «Готово» ставится сам.

import { t } from "./i18n.js";

/**
 * Все документы сайта. Это МАССИВ ОБЪЕКТОВ: [ {…}, {…}, … ]
 *  • id    — ключ переводов: тексты лежат в locales/*.json → docs.d1, docs.d2 …
 *  • url   — страница документа. Есть только у ГОТОВЫХ документов.
 *
 * Чтобы «включить» новый документ, достаточно дописать ему url.
 */
const DOCUMENTS = [
  { id: "d1", url: "rechtsvorschlag.html" },
  { id: "d2" },
  { id: "d3" },
  { id: "d4" },
  { id: "d5" },
  { id: "d6" },
];

/**
 * Строит HTML одной карточки.
 * doc — один объект из массива DOCUMENTS, например { id: 'd1', url: '…' }.
 */
function buildDocCard(doc) {
  const key = `docs.${doc.id}`; // 'docs.d1'
  const title = t(`${key}.title`);

  // Готовый документ → название-ссылка. Не готовый → просто текст.
  // (doc.url у неготовых документов — undefined, а undefined в условии считается «нет».)
  const titleHtml = doc.url
    ? `<a class="doc-card__link" href="${doc.url}">${title}</a>`
    : title;

  // ════════════════════════════════════════════════════════
  // 🏠 ДОМАШНЕЕ ЗАДАНИЕ (урок 7), часть A: честный статус
  //
  // Сейчас у ВСЕХ карточек статус «В подготовке» (серая метка).
  // Нужно: если у документа есть url — зелёная метка «Доступно».
  //
  // Подсказки:
  //  1. Замените две строки ниже тернарным оператором (как titleHtml выше):
  //       условие ? значениеЕслиДа : значениеЕслиНет
  //  2. Для готового документа:
  //       statusKey   → 'docs.statusReady'   (перевод уже есть на 4 языках)
  //       statusClass → 'tag--ready'         (стиль уже есть в _section.scss)
  //     Для неготового — оставьте то, что написано сейчас.
  //
  // Замените эти две строки 👇
  const statusKey = doc.url ? "docs.statusReady" : "docs.status";
  const statusClass = doc.url ? "tag--ready" : "tag--soon";
  // ════════════════════════════════════════════════════════

  return `
    <li>
      <article class="doc-card">
        <div class="doc-card__file" aria-hidden="true">📄</div>
        <div>
          <div class="doc-card__meta">
            <span class="tag">${t(`${key}.tag`)}</span>
            <span class="tag ${statusClass}">${t(statusKey)}</span>
          </div>
          <h3 class="doc-card__title">${titleHtml}</h3>
          <p class="doc-card__text">${t(`${key}.text`)}</p>
          <p class="doc-card__deadline">${t(`${key}.deadline`)}</p>
        </div>
      </article>
    </li>
  `;
}

export function initDocuments() {
  const list = document.querySelector("[data-js-docs-list]");
  if (!list) return; // на других страницах списка нет

  /** Перерисовать весь список (при запуске и при смене языка). */
  function render() {
    // ════════════════════════════════════════════════════════
    // 🏠 ДОМАШНЕЕ ЗАДАНИЕ (урок 7), часть B: массив → HTML
    //
    // Пока эта функция пустая, на странице видны старые карточки из index.html.
    // Нужно заменить их карточками, построенными из массива DOCUMENTS.
    //
    // Подсказки (всё решение — одна строка):
    //  1. DOCUMENTS.map(buildDocCard) — вызывает buildDocCard для КАЖДОГО
    //     документа и возвращает новый массив: 6 кусочков HTML.
    //  2. .join('') — склеивает массив в одну строку (без разделителя).
    //  3. Результат запишите в list.innerHTML.
    //
    // Вы уже видели этот приём: в letter-preview.js так строятся
    // «Следующие шаги» ( [...].map(...).join('') ).
    //
    // Бонус ⭐: покажите готовые документы первыми. Перед .map добавьте сортировку:
    //     [...DOCUMENTS].sort((a, b) => Boolean(b.url) - Boolean(a.url))
    //   • [...DOCUMENTS] — копия массива (sort меняет массив, а оригинал портить не нужно);
    //   • Boolean(x) превращает значение в true/false, а при вычитании true = 1, false = 0.
    //
    // Пишите код ниже этой строки 👇
    // ════════════════════════════════════════════════════════
    list.innerHTML = [...DOCUMENTS]
      .sort((a, b) => Boolean(b.url) - Boolean(a.url))
      .map(buildDocCard)
      .join('');
  }

  render();
  document.addEventListener("i18n:change", render); // перевести карточки на новый язык
}
