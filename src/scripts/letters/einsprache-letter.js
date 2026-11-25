// ── ПИСЬМО «EINSPRACHE GEGEN STRAFBEFEHL» НА ТРЁХ ЯЗЫКАХ ─
//
// ⚖️ Юридический текст письма — здесь. Его проверяет юрист (Игорь).
//
// Правовая основа (проверить по fedlex.admin.ch, StPO = SR 312.0):
//  • ст. 354 абз. 1 — возражение подаётся письменно в течение 10 дней
//    в орган, вынесший приказ (Staatsanwaltschaft / Übertretungsstrafbehörde);
//  • ст. 354 абз. 2 — обвиняемый НЕ обязан обосновывать возражение;
//  • ст. 101 и 107 — право на ознакомление с материалами дела (по желанию).
//
// Письмо намеренно короткое: без признаний и без доводов по существу.
// Дату пишем как «получил(а)», а не «вручено»: если сработала фикция
// вручения (ст. 85 абз. 4 StPO), юридическая дата вручения может быть раньше.
// Доводы человек приводит позже — на допросе или в суде.

import { escapeHtml } from '../utils.js';
import { formatLetterDate, fill, lines } from './letter-utils.js';

const TEXTS = {
  de: {
    locale: 'de-CH',
    registered: 'Einschreiben',
    subject: 'Einsprache gegen den Strafbefehl vom {orderDate} – Verfahren Nr. {caseNumber}',
    greeting: 'Sehr geehrte Damen und Herren',
    intro: 'Den Strafbefehl vom {orderDate} im oben genannten Verfahren habe ich am {receivedDate} erhalten.',
    opposition: 'Hiermit erhebe ich gegen diesen Strafbefehl Einsprache (Art. 354 StPO).',
    fileAccess: 'Zudem ersuche ich um Einsicht in die Verfahrensakten (Art. 101 und 107 StPO).',
    closing: 'Freundliche Grüsse',
  },
  fr: {
    locale: 'fr-CH',
    registered: 'Recommandé',
    subject: 'Opposition à l’ordonnance pénale du {orderDate} – Procédure n° {caseNumber}',
    greeting: 'Madame, Monsieur,',
    intro: 'J’ai reçu le {receivedDate} l’ordonnance pénale du {orderDate} rendue dans la procédure susmentionnée.',
    opposition: 'Par la présente, je forme opposition à cette ordonnance pénale (art. 354 CPP).',
    fileAccess: 'Je sollicite en outre la consultation du dossier de la procédure (art. 101 et 107 CPP).',
    closing: 'Veuillez agréer, Madame, Monsieur, mes salutations distinguées.',
  },
  it: {
    locale: 'it-CH',
    registered: 'Raccomandata',
    subject: 'Opposizione al decreto d’accusa del {orderDate} – Procedimento n. {caseNumber}',
    greeting: 'Gentili Signore e Signori,',
    intro: 'il {receivedDate} ho ricevuto il decreto d’accusa del {orderDate} emesso nel procedimento sopra indicato.',
    opposition: 'Con la presente interpongo opposizione al decreto d’accusa (art. 354 CPP).',
    fileAccess: 'Chiedo inoltre di poter consultare gli atti del procedimento (art. 101 e 107 CPP).',
    closing: 'Distinti saluti',
  },
};

/**
 * Собирает HTML письма.
 * data — данные формы, lang — язык письма ('de' | 'fr' | 'it'),
 * receivedDate — дата получения (объект Date).
 */
export function buildEinspracheLetter(data, lang, receivedDate) {
  const text = TEXTS[lang] ?? TEXTS.de;

  // Дата приказа приходит из поля type="date" как строка "2026-11-02"
  const [year, month, day] = data.orderDate.split('-').map(Number);
  const orderDate = new Date(year, month - 1, day);

  const values = {
    caseNumber: escapeHtml(data.caseNumber.trim()),
    orderDate: formatLetterDate(orderDate, text.locale),
    receivedDate: formatLetterDate(receivedDate, text.locale),
  };

  const fullName = escapeHtml(`${data.firstName.trim()} ${data.lastName.trim()}`);
  const city = escapeHtml(data.city.trim());
  const fileAccessHtml = data.fileAccess === 'yes' ? `<p>${text.fileAccess}</p>` : '';

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
    <p>${text.opposition}</p>
    ${fileAccessHtml}
    <p>${text.closing}</p>

    <div class="letter__signature">
      <span class="letter__signature-line"></span>
      ${fullName}
    </div>
  `;
}
