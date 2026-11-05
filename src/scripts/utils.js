// ── МАЛЕНЬКИЕ ПОЛЕЗНЫЕ ФУНКЦИИ ──────────────────────────

/**
 * Делает текст пользователя безопасным для вставки в HTML.
 *
 * Зачем: если человек введёт в поле что-то вроде <script>…</script>,
 * а мы вставим это через innerHTML, браузер выполнит этот код.
 * Это называется XSS-атака. Поэтому всё, что ввёл пользователь,
 * перед вставкой в HTML пропускаем через escapeHtml().
 */
export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Сумма в швейцарском формате: 1250.5 → "1’250.50" */
export function formatAmount(value) {
  return new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}
