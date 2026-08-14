import type { EngineeringStage } from './engineeringStage';
import type { Language } from './language';

export const stageName: Record<Language, Record<EngineeringStage, string>> = {
  kk: { design: 'ЖОБАЛАУ', manufacturing: 'ДАЙЫНДАУ', operations: 'ПАЙДАЛАНУ' },
  ru: { design: 'ПРОЕКТИРОВАНИЕ', manufacturing: 'ПРОИЗВОДСТВО', operations: 'ЭКСПЛУАТАЦИЯ' },
  en: { design: 'DESIGN', manufacturing: 'MANUFACTURING', operations: 'OPERATIONS' },
};

export function buildOutOfScopeFallback(language: Language) {
  if (language === 'en') {
    return 'I can answer only within Vectori topics: space, drones/aviation, spacecraft, materials, manufacturing, testing, operations, telemetry, and engineering documents.';
  }

  if (language === 'kk') {
    return 'Мен тек Vectori тақырыптары бойынша жауап беремін: ғарыш, дрондар/авиация, аппараттар, материалдар, өндіріс, сынақ, пайдалану, телеметрия және инженерлік құжаттар.';
  }

  return 'Я отвечаю только по тематике Vectori: космос, дроны/авиация, космические аппараты, материалы, производство, испытания, эксплуатация, телеметрия и инженерные документы.';
}

export function buildGeneralFallback(question: string, language: Language) {
  const normalized = question.toLowerCase();
  const isMars = normalized.includes('марс') || normalized.includes('mars');

  if (language === 'en') {
    return isMars
      ? 'Mars is the fourth planet from the Sun. It is called the Red Planet because iron oxide on its surface gives it a reddish color. Mars has a thin atmosphere, cold climate, polar ice caps, and two small moons: Phobos and Deimos.'
      : `This is a space/aerospace topic: "${question}". Please ask a little more specifically, and I will answer briefly.`;
  }

  if (language === 'kk') {
    return isMars
      ? 'Марс — Күннен санағанда төртінші планета. Оны қызыл планета деп атайды, себебі бетінде темір оксиді көп. Марста жұқа атмосфера, суық климат, полярлық мұздар және екі серік бар: Фобос пен Деймос.'
      : `Бұл ғарыш/аэроғарыш тақырыбы: "${question}". Нақтырақ жазсаңыз, қысқа жауап беремін.`;
  }

  return isMars
    ? 'Марс — четвёртая планета от Солнца. Его называют Красной планетой из-за оксида железа на поверхности. У Марса тонкая атмосфера, холодный климат, полярные ледяные шапки и два спутника: Фобос и Деймос.'
    : `Это тема космоса или аэрокосмической инженерии: "${question}". Уточни вопрос немного, и я отвечу коротко.`;
}

export function selectByStage(stage: EngineeringStage, values: Record<EngineeringStage, string>) {
  return values[stage];
}

export function materialName(material: string) {
  if (material === 'carbon') return 'CFRP';
  if (material === 'titanium') return 'Ti-6Al-4V';
  if (material === 'aluminum-7075') return 'Al 7075-T6';
  if (material === 'aluminum-2024') return 'Al 2024';
  return material;
}

export function processName(process: string) {
  if (process === 'autoclave') return 'автоклавное формование';
  if (process === 'dmls') return 'DMLS additive manufacturing';
  if (process === 'cnc') return 'ЧПУ-фрезерование';
  return process;
}
