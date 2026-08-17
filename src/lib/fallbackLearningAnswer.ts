import type { Language } from './language';

const learningTriggers = [
  'что такое',
  'кто такой',
  'почему',
  'зачем',
  'как работает',
  'как летает',
  'объясни',
  'простыми словами',
  'что значит',
  'чем отличается',
];

const engineeringTriggers = [
  'лучше использовать',
  'что лучше',
  'для полета',
  'для полёта',
  'полет',
  'полёт',
  'запуск',
  'доставить',
  'долететь',
  'лететь на',
  'рассчитай',
  'расчет',
  'расчёт',
  'подбери',
  'выбери материал',
  'сравни',
  'риск',
  'риски',
  'стандарт',
  'норматив',
  'производство',
  'эксплуатация',
  'миссия',
  'параметр',
];

export function buildFallbackLearningAnswer(question: string, language: Language) {
  const normalized = question.toLowerCase().trim();
  if (isMarsFlightQuestion(normalized)) return marsFlightAnswer(language);
  if (!isLearningQuestion(normalized)) return '';

  if (isDefinitionQuestion(normalized, ['марс', 'mars'])) return marsAnswer(language);
  if (hasAny(normalized, ['спутник', 'satellite'])) return satelliteAnswer(language);
  if (hasAny(normalized, ['ракета', 'rocket'])) return rocketAnswer(language);
  if (hasAny(normalized, ['самол', 'airplane', 'plane'])) return airplaneAnswer(language);

  return generalAerospaceAnswer(language);
}

export function isLearningQuestion(question: string) {
  const normalized = question.toLowerCase().trim();
  if (engineeringTriggers.some((word) => normalized.includes(word))) return false;
  return learningTriggers.some((word) => normalized.includes(word));
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function isDefinitionQuestion(text: string, words: string[]) {
  return hasAny(text, words) && hasAny(text, ['что такое', 'кто такой', 'что значит']);
}

function isMarsFlightQuestion(text: string) {
  return hasAny(text, ['марс', 'mars']) && hasAny(text, [
    'лететь',
    'полет',
    'полёт',
    'полета',
    'полёта',
    'долететь',
    'доставить',
    'запуск',
    'миссия',
    'лучше использовать',
    'что лучше',
  ]);
}

function marsAnswer(language: Language) {
  if (language === 'en') {
    return 'Mars is the fourth planet from the Sun. It is called the Red Planet because iron-rich dust on its surface looks reddish. Mars has a thin carbon-dioxide atmosphere, polar ice caps, huge volcanoes, and signs that liquid water existed there long ago.';
  }

  if (language === 'kk') {
    return 'Марс — Күннен санағанда төртінші планета. Оны Қызыл планета дейді, өйткені бетіндегі темір оксиді бар шаң қызылдау көрінеді. Марста жұқа көмірқышқыл газ атмосферасы, полярлық мұздар және бұрын су болғанын көрсететін белгілер бар.';
  }

  return 'Марс — четвёртая планета от Солнца. Его называют Красной планетой из-за красноватой пыли с оксидами железа на поверхности. У Марса тонкая атмосфера из углекислого газа, полярные ледяные шапки, огромные вулканы и следы того, что раньше там могла быть жидкая вода.';
}

function marsFlightAnswer(language: Language) {
  if (language === 'en') {
    return 'For a Mars flight, the best baseline is not an airplane or drone, but a launch vehicle plus an interplanetary spacecraft. Usually it needs: a chemical rocket for launch from Earth, an upper stage or electric propulsion for the transfer, a protected spacecraft with navigation, communication, thermal control, radiation protection, and a lander or rover if the goal is the surface.';
  }

  if (language === 'kk') {
    return 'Марсқа ұшу үшін ұшақ немесе дрон емес, зымыран-тасығыш және планетааралық ғарыш аппараты керек. Негізгі құрам: Жерден ұшыратын химиялық зымыран, Марсқа бағыттайтын жоғарғы саты немесе электрлік қозғалтқыш, байланыс, навигация, жылу бақылауы, радиациядан қорғаныс және қажет болса қону модулі/ровер.';
  }

  return 'Для полёта на Марс лучше использовать не самолёт и не дрон, а связку: ракета-носитель + межпланетный космический аппарат. Обычно нужны химическая ракета для старта с Земли, разгонный блок или электрореактивная тяга для перелёта, система связи и навигации, термоконтроль, радиационная защита, а если цель — поверхность Марса, ещё посадочный модуль или ровер.';
}

function satelliteAnswer(language: Language) {
  if (language === 'en') return 'A satellite is an object that moves around a larger body in orbit. Natural satellites include moons; artificial satellites help with communication, navigation, weather, science, and Earth observation.';
  if (language === 'kk') return 'Спутник — үлкен денені орбита бойымен айналып жүретін объект. Табиғи спутникке Ай жатады, ал жасанды спутниктер байланыс, навигация, ауа райы және Жерді бақылау үшін қолданылады.';
  return 'Спутник — это объект, который движется по орбите вокруг более крупного тела. Бывают естественные спутники, например Луна, и искусственные: они нужны для связи, навигации, прогноза погоды, науки и наблюдения Земли.';
}

function rocketAnswer(language: Language) {
  if (language === 'en') return 'A rocket is a vehicle or engine that creates thrust by throwing mass backward at high speed. That is why rockets can work in space, where there is no air for propellers or jet intake.';
  if (language === 'kk') return 'Ракета — массаны үлкен жылдамдықпен артқа лақтырып, алға тарту күшін жасайтын аппарат немесе қозғалтқыш. Сондықтан ракета ауа жоқ ғарышта да жұмыс істей алады.';
  return 'Ракета — это аппарат или двигатель, который создаёт тягу, выбрасывая массу назад с большой скоростью. Поэтому ракеты могут работать даже в космосе, где нет воздуха для винта или обычного реактивного двигателя.';
}

function airplaneAnswer(language: Language) {
  if (language === 'en') return 'An airplane flies because its wings create lift: air moves around the wing, pressure and flow direction change, and the wing pushes air downward. The engine provides forward speed, and the wing turns that motion into lift.';
  if (language === 'kk') return 'Ұшақ қанаты көтергіш күш жасағандықтан ұшады: ауа қанат айналасынан өтіп, қысым мен ағын бағыты өзгереді. Қозғалтқыш алға жылдамдық береді, ал қанат оны көтергіш күшке айналдырады.';
  return 'Самолёт летит, потому что крыло создаёт подъёмную силу: поток воздуха обтекает крыло, давление и направление потока меняются, и крыло как бы отталкивает воздух вниз. Двигатель даёт скорость вперёд, а крыло превращает её в подъём.';
}

function generalAerospaceAnswer(language: Language) {
  if (language === 'en') return 'This is a general aerospace question. Ask it a little more specifically, and I will explain it simply without turning it into an engineering report.';
  if (language === 'kk') return 'Бұл авиация немесе ғарыш туралы жалпы сұрақ. Сәл нақтырақ жазсаң, мен оны инженерлік есепке айналдырмай, қарапайым тілмен түсіндіремін.';
  return 'Это общий вопрос по авиации или космосу. Напиши его чуть точнее — и я объясню простыми словами, без инженерного отчёта, стандартов и лишних рисков.';
}
