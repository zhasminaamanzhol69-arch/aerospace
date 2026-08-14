import type { Language } from './language';

type DocumentAnalyzerCopy = {
  title: string;
  body: string;
  current: string;
  previous: string;
  question: string;
  loading: string;
  ask: string;
  uploadFirst: string;
  analyzing: string;
  done: string;
  chars: string;
  sources: string;
  diff: string;
  quick: string[];
};

export const documentAnalyzerText: Record<Language, DocumentAnalyzerCopy> = {
  kk: {
    title: 'Инженерлік құжатты талдау',
    body: 'ТУ, ГОСТ, ОСТ, нұсқаулық, сызба мәтіні немесе құжат редакциясын жүктеңіз.',
    current: 'Негізгі құжат',
    previous: 'Алдыңғы редакция',
    question: 'Құжат бойынша сұрақ',
    loading: 'Өңдеу...',
    ask: 'Құжатты талдау',
    uploadFirst: 'Алдымен негізгі құжатты жүктеңіз.',
    analyzing: 'Құжат талданып жатыр...',
    done: 'Талдау дайын.',
    chars: 'таңба',
    sources: 'Дереккөздер',
    diff: 'Редакциялар айырмасы',
    quick: ['Бұл торапқа қандай талаптар қойылады?', 'Сапа бақылауы бойынша барлық талаптарды тап.', 'Қандай тармақтар пайдалануға қатысты?', 'Бұл редакцияны алдыңғысымен салыстыр.'],
  },
  ru: {
    title: 'Анализ инженерного документа',
    body: 'Загрузите ТУ, ГОСТ, ОСТ, руководство, чертёжный текст или редакцию документа.',
    current: 'Основной документ',
    previous: 'Предыдущая редакция',
    question: 'Вопрос по документу',
    loading: 'Обработка...',
    ask: 'Анализировать документ',
    uploadFirst: 'Сначала загрузите основной документ.',
    analyzing: 'Анализирую документ...',
    done: 'Анализ готов.',
    chars: 'символов',
    sources: 'Источники в документе',
    diff: 'Сравнение редакций',
    quick: ['Какие требования предъявляются к этому узлу?', 'Найди все требования по контролю качества.', 'Какие пункты относятся к эксплуатации?', 'Сравни эту редакцию с предыдущей.'],
  },
  en: {
    title: 'Engineering Document Analysis',
    body: 'Upload a specification, standard, manual, drawing text, or document revision.',
    current: 'Current document',
    previous: 'Previous revision',
    question: 'Document question',
    loading: 'Processing...',
    ask: 'Analyze document',
    uploadFirst: 'Upload the current document first.',
    analyzing: 'Analyzing document...',
    done: 'Analysis ready.',
    chars: 'characters',
    sources: 'Source Attribution',
    diff: 'Revision Diff',
    quick: ['What requirements apply to this assembly?', 'Find all quality-control requirements.', 'Which clauses relate to operations?', 'Compare this revision with the previous one.'],
  },
};
