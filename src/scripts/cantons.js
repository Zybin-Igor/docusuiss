// ── ОФИЦИАЛЬНЫЕ ЯЗЫКИ КАНТОНОВ ──────────────────────────
//
// Письмо в ведомство нужно писать на официальном языке кантона.
// В двуязычных кантонах (Берн, Фрибур, Вале, Граубюнден) язык выбирает
// пользователь — первым в списке стоит основной язык кантона.
//
// de — немецкий, fr — французский, it — итальянский

const CANTON_LANGUAGES = {
  AG: ['de'],
  AI: ['de'],
  AR: ['de'],
  BE: ['de', 'fr'],
  BL: ['de'],
  BS: ['de'],
  FR: ['fr', 'de'],
  GE: ['fr'],
  GL: ['de'],
  GR: ['de', 'it'],
  JU: ['fr'],
  LU: ['de'],
  NE: ['fr'],
  NW: ['de'],
  OW: ['de'],
  SG: ['de'],
  SH: ['de'],
  SO: ['de'],
  SZ: ['de'],
  TG: ['de'],
  TI: ['it'],
  UR: ['de'],
  VD: ['fr'],
  VS: ['fr', 'de'],
  ZG: ['de'],
  ZH: ['de'],
};

/** Список языков письма для кантона. Пример: getLetterLanguages('BE') → ['de', 'fr'] */
export function getLetterLanguages(canton) {
  return CANTON_LANGUAGES[canton] ?? [];
}
