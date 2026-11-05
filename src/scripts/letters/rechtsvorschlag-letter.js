// ── ПИСЬМО «RECHTSVORSCHLAG» НА ТРЁХ ЯЗЫКАХ ─────────────
//
// ⚖️ Юридический текст письма — здесь. Его проверяет юрист (Игорь).
// Тексты письма НЕ лежат в locales/*.json: язык письма зависит от кантона,
// а не от языка, который посетитель выбрал для сайта.
//
// В фигурных скобках — данные из формы: {creditor}, {caseNumber} и т. д.

import { escapeHtml, formatAmount } from '../utils.js';

const TEXTS = {
  de: {
    locale: 'de-CH',
    registered: 'Einschreiben',
    subject: 'Rechtsvorschlag – Betreibung Nr. {caseNumber}',
    greeting: 'Sehr geehrte Damen und Herren',
    intro:
      'In der oben genannten Betreibung, die {creditor} gegen mich angehoben hat, wurde mir der Zahlungsbefehl am {receivedDate} zugestellt.',
    full: 'Hiermit erhebe ich gegen diesen Zahlungsbefehl vollumfänglich Rechtsvorschlag. Ich bestreite die Forderung im gesamten Betrag von CHF {claimAmount}.',
    partial:
      'Hiermit erhebe ich gegen diesen Zahlungsbefehl teilweise Rechtsvorschlag. Ich bestreite die Forderung im Betrag von CHF {contestedAmount} (Gesamtforderung: CHF {claimAmount}).',
    confirmation:
      'Ich bitte Sie, mir die Erhebung des Rechtsvorschlags gebührenfrei schriftlich zu bestätigen (Art. 74 Abs. 3 SchKG).',
    closing: 'Freundliche Grüsse',
  },
  fr: {
    locale: 'fr-CH',
    registered: 'Recommandé',
    subject: 'Opposition au commandement de payer – Poursuite n° {caseNumber}',
    greeting: 'Madame, Monsieur,',
    intro:
      'Dans la poursuite susmentionnée, introduite contre moi par {creditor}, le commandement de payer m’a été notifié le {receivedDate}.',
    full: 'Par la présente, je forme opposition totale à ce commandement de payer. Je conteste la créance dans son intégralité, soit CHF {claimAmount}.',
    partial:
      'Par la présente, je forme opposition partielle à ce commandement de payer. Je conteste la créance à hauteur de CHF {contestedAmount} (montant total réclamé : CHF {claimAmount}).',
    confirmation:
      'Je vous prie de bien vouloir m’attester gratuitement par écrit que l’opposition a été formée (art. 74 al. 3 LP).',
    closing: 'Veuillez agréer, Madame, Monsieur, mes salutations distinguées.',
  },
  it: {
    locale: 'it-CH',
    registered: 'Raccomandata',
    subject: 'Opposizione al precetto esecutivo – Esecuzione n. {caseNumber}',
    greeting: 'Gentili Signore e Signori,',
    intro:
      'nell’esecuzione sopra indicata, promossa nei miei confronti da {creditor}, il precetto esecutivo mi è stato notificato il {receivedDate}.',
    full: 'Con la presente interpongo opposizione totale al precetto esecutivo. Contesto il credito nella sua totalità, pari a CHF {claimAmount}.',
    partial:
      'Con la presente interpongo opposizione parziale al precetto esecutivo. Contesto il credito per l’importo di CHF {contestedAmount} (credito totale: CHF {claimAmount}).',
    confirmation:
      'Vi chiedo cortesemente di attestarmi gratuitamente per iscritto l’avvenuta opposizione (art. 74 cpv. 3 LEF).',
    closing: 'Distinti saluti',
  },
};

/** Дата прописью на языке письма: «29. Oktober 2026», «29 octobre 2026» */
function formatLetterDate(date, locale) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

/** Подставляет значения в шаблон: fill('Nr. {caseNumber}', { caseNumber: '123' }) → 'Nr. 123' */
function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}

/** Многострочный текст (адрес) → строки, разделённые <br> */
function lines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(escapeHtml)
    .join('<br />');
}

/**
 * Собирает HTML письма.
 * data — данные формы, lang — язык письма ('de' | 'fr' | 'it'),
 * receivedDate — дата получения (объект Date).
 */
export function buildRechtsvorschlagLetter(data, lang, receivedDate) {
  const text = TEXTS[lang] ?? TEXTS.de;

  // Все данные пользователя экранируем ОДИН раз, здесь
  const values = {
    caseNumber: escapeHtml(data.caseNumber.trim()),
    creditor: escapeHtml(data.creditor.trim()),
    receivedDate: formatLetterDate(receivedDate, text.locale),
    claimAmount: formatAmount(data.claimAmount),
    contestedAmount: data.contestedAmount ? formatAmount(data.contestedAmount) : '',
  };

  const fullName = escapeHtml(`${data.firstName.trim()} ${data.lastName.trim()}`);
  const city = escapeHtml(data.city.trim());
  const opposition = data.scope === 'partial' ? text.partial : text.full;

  return `
    <div class="letter__sender">
      ${fullName}<br />
      ${escapeHtml(data.street.trim())}<br />
      ${escapeHtml(data.zip.trim())} ${city}
    </div>

    <div class="letter__recipient">
      <p class="letter__registered">${text.registered}</p>
      ${lines(data.office)}
    </div>

    <p class="letter__place-date">${city}, ${formatLetterDate(new Date(), text.locale)}</p>

    <p class="letter__subject">${fill(text.subject, values)}</p>

    <p>${text.greeting}</p>
    <p>${fill(text.intro, values)}</p>
    <p>${fill(opposition, values)}</p>
    <p>${text.confirmation}</p>
    <p>${text.closing}</p>

    <div class="letter__signature">
      <span class="letter__signature-line"></span>
      ${fullName}
    </div>
  `;
}
