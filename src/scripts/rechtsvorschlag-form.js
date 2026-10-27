// ── ФОРМА «ВОЗРАЖЕНИЕ ПРОТИВ ПЛАТЁЖНОГО ТРЕБОВАНИЯ» ─────
//
// Урок 1: читаем данные формы и показываем/прячем поле «частично».
// Урок 2: расчёт 10-дневного срока и проверка полей.
// Урок 3: текст письма на языке кантона.
// Урок 4: печать / сохранение в PDF.

export function initRechtsvorschlagForm() {
  // Находим элементы на странице по data-js-атрибутам
  const form = document.querySelector('[data-js-rv-form]');
  if (!form) return; // на других страницах формы нет — просто выходим

  const partialField = form.querySelector('[data-js-partial-field]');
  const scopeRadios = form.querySelectorAll('input[name="scope"]');

  // ════════════════════════════════════════════════════════
  // 🏠 ДОМАШНЕЕ ЗАДАНИЕ (урок 1)
  //
  // Сейчас поле «Оспариваемая сумма» всегда скрыто (атрибут hidden).
  // Нужно: когда пользователь выбирает «Оспариваю только часть» —
  // поле появляется, а когда «Оспариваю весь долг» — снова прячется.
  //
  // Подсказки:
  //  1. Переберите радиокнопки: 
  // scopeRadios.forEach((radio) => { ... })
  //  2. Внутри повесьте обработчик события 'change':
  //       radio.addEventListener('change', () => { ... })
  //  3. Узнать выбранное значение: radio.value  ('full' или 'partial')
  //  4. Показать/спрятать элемент: partialField.hidden = true / false
  //
  // Бонус ⭐: когда поле показано, сделайте его обязательным:
  //   form.contestedAmount.required = true (и false, когда спрятано)
  //
  // Пишите код ниже этой строки 👇

  // ════════════════════════════════════════════════════════
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

  // Отправка формы. Пока только собираем данные и выводим их в консоль
  // (F12 → вкладка «Console»). Письмо сформируем на следующих уроках.
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // не перезагружать страницу

    // FormData собирает все поля формы по их атрибуту name
    const data = Object.fromEntries(new FormData(form));
    console.log('Данные формы:', data);
  });
}