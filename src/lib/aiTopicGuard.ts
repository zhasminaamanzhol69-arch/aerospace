import type { Language } from './language';

const aerospaceTerms = [
  'авиа',
  'аэро',
  'самол',
  'вертол',
  'дрон',
  'бпла',
  'ракета',
  'космос',
  'косми',
  'орбит',
  'спутник',
  'кубсат',
  'марс',
  'луна',
  'планет',
  'звезд',
  'звёзд',
  'двигател',
  'тяга',
  'крыл',
  'фюзеляж',
  'аэродинами',
  'полёт',
  'полет',
  'взлёт',
  'взлет',
  'посад',
  'мисси',
  'навигац',
  'телеметр',
  'термоконтрол',
  'радиаци',
  'материал',
  'прочност',
  'производств',
  'эксплуатац',
  'air',
  'aero',
  'aircraft',
  'airplane',
  'plane',
  'drone',
  'uav',
  'rocket',
  'space',
  'satellite',
  'orbit',
  'mars',
  'moon',
  'planet',
  'wing',
  'engine',
  'thrust',
  'flight',
  'launch',
  'spacecraft',
  'cubesat',
];

export function isAerospaceQuestion(question: string) {
  const normalized = question.toLowerCase().trim();
  if (!normalized) return true;
  return aerospaceTerms.some((term) => normalized.includes(term));
}

export function isAerospaceDocument(name: string, text: string) {
  const normalized = `${name}\n${text.slice(0, 12000)}`.toLowerCase();
  return aerospaceTerms.some((term) => normalized.includes(term));
}

export function buildOutOfScopeAnswer(language: Language) {
  if (language === 'en') {
    return 'This request is outside the aerospace scope of the system. I can answer questions about aviation, space, rockets, satellites, spacecraft, aerospace design, manufacturing, operations, and engineering calculations.';
  }

  if (language === 'kk') {
    return 'Бұл сұрақ жүйенің аэрокосмостық тақырыбына жатпайды. Мен авиация, ғарыш, зымырандар, спутниктер, ғарыш аппараттары, жобалау, өндіріс, пайдалану және инженерлік есептер туралы сұрақтарға жауап бере аламын.';
  }

  return 'Этот запрос не относится к аэрокосмической тематике системы. Я могу отвечать на вопросы про авиацию, космос, ракеты, спутники, космические аппараты, проектирование, производство, эксплуатацию и инженерные расчёты.';
}

export function buildOutOfScopeDocumentAnswer(language: Language) {
  if (language === 'en') {
    return 'The uploaded document does not appear to be related to the aerospace scope of this system. I can analyze documents about aviation, space, rockets, satellites, spacecraft, aerospace design, manufacturing, operations, standards, and engineering calculations.';
  }

  if (language === 'kk') {
    return 'Жүктелген құжат бұл жүйенің аэрокосмостық тақырыбына жатпайтын сияқты. Мен авиация, ғарыш, зымырандар, спутниктер, ғарыш аппараттары, жобалау, өндіріс, пайдалану, стандарттар және инженерлік есептер туралы құжаттарды талдай аламын.';
  }

  return 'Загруженный документ не относится к аэрокосмической тематике системы. Я могу анализировать документы про авиацию, космос, ракеты, спутники, космические аппараты, проектирование, производство, эксплуатацию, стандарты и инженерные расчёты.';
}
