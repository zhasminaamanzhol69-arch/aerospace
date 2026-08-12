import type { ExtractedDocument } from './documentExtraction';

export function buildLocalDocumentAnswer(
  doc: ExtractedDocument,
  question: string,
  previous?: ExtractedDocument | null,
) {
  const query = question.toLowerCase();

  if (isCompareQuestion(query)) return compareDocuments(doc, previous);

  const kind = getQuestionKind(query);
  const matches = findRelevantLines(doc.text, kind.patterns, question);
  const title = kind.title;
  const body = matches.length > 0
    ? matches.slice(0, 8).map((line, index) => `${index + 1}. ${line}`).join('\n')
    : 'Точные пункты не найдены в извлечённом тексте. Попробуйте уточнить узел, термин или раздел документа.';

  return [
    `Документ: ${doc.name} (${doc.type}${doc.pageCount ? `, ${doc.pageCount} стр.` : ''})`,
    `Запрос: ${question}`,
    '',
    title,
    body,
    '',
    'Инженерное ограничение: ответ построен по тексту загруженного документа. Для юридически точной ссылки проверьте оригинальный пункт, таблицу и редакцию стандарта.',
  ].join('\n');
}

function getQuestionKind(query: string) {
  if (/(контрол|качест|ndt|дефект|испыт|приемк|quality|inspection|test)/i.test(query)) {
    return { title: 'Найденные требования по контролю качества:', patterns: qualityPatterns };
  }

  if (/(эксплуатац|пользован|то\b|ремонт|безопас|preflight|maintenance|operation|safety)/i.test(query)) {
    return { title: 'Пункты, относящиеся к эксплуатации:', patterns: operationPatterns };
  }

  return { title: 'Требования, найденные по документу:', patterns: requirementPatterns };
}

function findRelevantLines(text: string, patterns: RegExp[], question: string) {
  const keywords = question
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 3);

  return splitDocument(text)
    .map((line) => line.trim())
    .filter((line) => line.length > 24)
    .filter((line) => patterns.some((pattern) => pattern.test(line)) || keywords.some((word) => line.toLowerCase().includes(word)))
    .slice(0, 40);
}

function compareDocuments(current: ExtractedDocument, previous?: ExtractedDocument | null) {
  if (!previous) {
    return 'Для сравнения редакций загрузите предыдущую редакцию документа во второе поле.';
  }

  const prev = new Set(splitDocument(previous.text).map(normalizeLine));
  const curr = new Set(splitDocument(current.text).map(normalizeLine));
  const added = [...curr].filter((line) => line.length > 30 && !prev.has(line)).slice(0, 8);
  const removed = [...prev].filter((line) => line.length > 30 && !curr.has(line)).slice(0, 8);

  return [
    `Сравнение редакций: ${previous.name} → ${current.name}`,
    '',
    'Добавлено / изменено в новой редакции:',
    formatLines(added),
    '',
    'Удалено или изменено относительно предыдущей редакции:',
    formatLines(removed),
  ].join('\n');
}

function splitDocument(text: string) {
  return text
    .replace(/\r/g, '\n')
    .split(/\n|(?<=[.!?])\s+(?=[А-ЯA-Z0-9])/)
    .map((line) => line.replace(/\s+/g, ' ').trim());
}

function formatLines(lines: string[]) {
  return lines.length ? lines.map((line, index) => `${index + 1}. ${line}`).join('\n') : 'Существенные различия не найдены.';
}

function normalizeLine(line: string) {
  return line.toLowerCase().replace(/\s+/g, ' ').trim();
}

function isCompareQuestion(query: string) {
  return /(сравн|редакц|предыдущ|изменен|difference|compare|revision)/i.test(query);
}

const requirementPatterns = [
  /(должен|должна|должно|должны|требован|необходимо|следует|shall|must|required)/i,
  /(норма|допуск|предел|значение|пункт|раздел|таблиц)/i,
];

const qualityPatterns = [
  /(контрол|качест|приемк|испыт|провер|дефект|ультразвук|рентген|ndt|inspection|quality|test)/i,
  /(измерен|визуаль|протокол|акт|сертификат)/i,
];

const operationPatterns = [
  /(эксплуатац|обслужив|ремонт|безопас|отказ|авар|предпол|то\b|operation|maintenance|safety)/i,
  /(ресурс|периодич|инструкц|персонал|условия применения)/i,
];
