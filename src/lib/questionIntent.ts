import type { Language } from './language';

const kazakhLetters = /[әғқңөұүһі]/i;
const cyrillicLetters = /[а-яё]/i;
const englishWords = /\b(what|why|how|which|where|when|is|are|the)\b/i;

const aerospaceWords = [
  'uav', 'drone', 'fixed wing', 'vtol', 'cubesat', 'satellite', 'payload', 'mtow',
  'mos', 'ndt', 'wing', 'orbit', 'telemetry', 'space', 'spacecraft', 'rocket',
  'mars', 'moon', 'planet', 'composite', 'alloy', 'material', 'manufacturing',
  'аэр', 'бпла', 'дрон', 'спутник', 'космос', 'космич', 'ракета', 'марс',
  'луна', 'планет', 'кубсат', 'орбит', 'нагруз', 'материал', 'сплав',
  'композит', 'прочност', 'телеметр', 'производ', 'испытан', 'эксплуатац',
  'өндір', 'жобалау', 'пайдалану', 'ұшу', 'ғарыш', 'материал', 'сынақ',
];

const generalQuestionStarts = [
  'что такое', 'кто такой', 'кто такая', 'объясни', 'расскажи',
  'what is', 'who is', 'explain', 'tell me',
  'не', 'это',
];

export function detectAnswerLanguage(question: string, fallback: Language): Language {
  if (kazakhLetters.test(question)) return 'kk';
  if (cyrillicLetters.test(question)) return 'ru';
  if (englishWords.test(question)) return 'en';
  return fallback;
}

export function isGeneralKnowledgeQuestion(question: string) {
  const normalized = question.trim().toLowerCase();
  const hasAerospaceWord = aerospaceWords.some((word) => normalized.includes(word));
  const hasGeneralStart = generalQuestionStarts.some((start) => normalized.startsWith(start));
  const isShort = normalized.split(/\s+/).length <= 5;
  return hasAerospaceWord && (hasGeneralStart || isShort);
}

export function isInAerospaceScope(question: string) {
  const normalized = question.trim().toLowerCase();
  if (!normalized) return true;
  return aerospaceWords.some((word) => normalized.includes(word));
}
