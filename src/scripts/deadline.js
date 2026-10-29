// ── РАСЧЁТ СРОКА ДЛЯ ВОЗРАЖЕНИЯ (Rechtsvorschlag) ──────
//
// Правила (проверить юристу!):
//  • Срок — 10 дней с вручения платёжного требования (ст. 74 абз. 1 SchKG).
//  • День вручения не считается: отсчёт начинается со следующего дня (ст. 31 SchKG).
//  • Если последний день — суббота, воскресенье или официальный праздник,
//    срок переносится на следующий рабочий день (ст. 31 SchKG).
//  • Мы учитываем только праздники, которые есть во ВСЕХ кантонах.
//    Кантональные праздники не учитываем — так срок получается
//    «с запасом», никогда не позже настоящего.
//
// Здесь только «чистые» функции: получили дату → вернули результат.
// Они ничего не знают о странице, поэтому их легко проверять и переиспользовать.

const DEADLINE_DAYS = 10;

/**
 * Превращает строку из поля <input type="date"> ("2026-11-05") в дату.
 * Важно: создаём дату в МЕСТНОМ времени. new Date("2026-11-05") создала бы
 * дату по Гринвичу, и в Швейцарии иногда получился бы предыдущий день.
 */
export function parseDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day); // месяцы в JS считаются с 0!
}

/** Возвращает НОВУЮ дату, сдвинутую на нужное количество дней. */
export function addDays(date, days) {
  const result = new Date(date); // копия, чтобы не испортить исходную дату
  result.setDate(result.getDate() + days);
  return result;
}

/** Одинаковый ли это день (без учёта часов и минут)? */
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ════════════════════════════════════════════════════════
// 🏠 ДОМАШНЕЕ ЗАДАНИЕ (урок 2)
//
// Функция должна вернуть true, если дата — суббота или воскресенье,
// и false в остальные дни.
//
// Подсказки:
//  1. date.getDay() возвращает номер дня недели:
//       0 — воскресенье, 1 — понедельник, ... 6 — суббота
//  2. Сохраните его в переменную: const dayOfWeek = date.getDay();
//  3. Верните результат сравнения: return dayOfWeek === 0 || ...
//     (оператор || означает «или»)
//
// Сейчас функция всегда возвращает false — поэтому выходные пока
// НЕ учитываются. Замените строку return false; своим кодом 👇
export function isWeekend(date) {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}
// ════════════════════════════════════════════════════════

/**
 * Дата Пасхи (воскресенье) для любого года.
 * Это известный «григорианский алгоритм» — запоминать его не нужно,
 * его просто копируют. От Пасхи зависят Вознесение и Betreibungsferien.
 */
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = март, 4 = апрель
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/**
 * Праздники, которые есть во всех кантонах Швейцарии.
 * (Страстная пятница, Пасхальный понедельник, Троица, 26 декабря и др.
 *  есть не везде — их не учитываем, чтобы не продлить срок ошибочно.)
 */
function getNationwideHolidays(year) {
  const easter = getEasterSunday(year);
  return [
    new Date(year, 0, 1), // Новый год
    addDays(easter, 39), // Вознесение (Auffahrt / Ascension)
    new Date(year, 7, 1), // Национальный праздник, 1 августа
    new Date(year, 11, 25), // Рождество
  ];
}

export function isHoliday(date) {
  return getNationwideHolidays(date.getFullYear()).some((holiday) => isSameDay(holiday, date));
}

/** Нерабочий день = выходной ИЛИ праздник. */
function isNonWorkingDay(date) {
  return isWeekend(date) || isHoliday(date);
}

/**
 * Главная функция: последний день срока.
 * Прибавляем 10 дней, а затем, пока попадаем на нерабочий день, двигаемся на день вперёд.
 */
export function calculateDeadline(receivedDate) {
  let deadline = addDays(receivedDate, DEADLINE_DAYS);

  while (isNonWorkingDay(deadline)) {
    deadline = addDays(deadline, 1);
  }

  return deadline;
}

/**
 * «Betreibungsferien» — каникулы в делах о взыскании (ст. 56 SchKG):
 * 7 дней до и после Пасхи и Рождества, а также с 15 по 31 июля.
 * Если срок кончается в эти дни, по ст. 63 SchKG он может продлеваться.
 * Мы НЕ продлеваем срок автоматически, а только предупреждаем пользователя.
 */
export function isInDebtCollectionHolidays(date) {
  const year = date.getFullYear();
  const easter = getEasterSunday(year);
  const time = date.getTime();

  const ranges = [
    [addDays(easter, -7), addDays(easter, 7)], // вокруг Пасхи
    [new Date(year, 6, 15), new Date(year, 6, 31)], // 15–31 июля
    [new Date(year, 11, 18), new Date(year, 11, 31)], // Рождество (этого года)
    [new Date(year, 0, 1), new Date(year, 0, 1)], // …и 1 января (после Рождества прошлого года)
  ];

  return ranges.some(([start, end]) => time >= start.getTime() && time <= end.getTime());
}

/** Сколько полных дней осталось от сегодня до даты (может быть отрицательным). */
export function daysUntil(date, today = new Date()) {
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const MS_IN_DAY = 24 * 60 * 60 * 1000;
  return Math.round((date - startOfToday) / MS_IN_DAY);
}
