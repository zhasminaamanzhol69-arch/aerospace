import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospace';
import type { EngineeringStage } from './engineeringStage';
import type { Language } from './language';

const stageName: Record<Language, Record<EngineeringStage, string>> = {
  kk: { design: 'ЖОБАЛАУ', manufacturing: 'ДАЙЫНДАУ', operations: 'ПАЙДАЛАНУ' },
  ru: { design: 'ПРОЕКТИРОВАНИЕ', manufacturing: 'ПРОИЗВОДСТВО', operations: 'ЭКСПЛУАТАЦИЯ' },
  en: { design: 'DESIGN', manufacturing: 'MANUFACTURING', operations: 'OPERATIONS' },
};

export function buildFallbackEngineeringReport(
  req: MissionRequirements,
  params: CalculatedParameters,
  options: DesignOption[],
  language: Language,
  stage: EngineeringStage,
  question: string,
) {
  if (language === 'en') return buildEnglishReport(req, params, options, stage, question);
  if (language === 'kk') return buildKazakhReport(req, params, options, stage, question);
  return buildRussianReport(req, params, options, stage, question);
}

function buildRussianReport(
  req: MissionRequirements,
  params: CalculatedParameters,
  options: DesignOption[],
  stage: EngineeringStage,
  question: string,
) {
  const domain = req.vehicleDomain === 'spacecraft' ? 'космический аппарат CubeSat/Satellite' : 'авиационный аппарат / БПЛА';
  const designDecision = req.vehicleDomain === 'spacecraft'
    ? `Для запроса "${question}" базовая архитектура: ${domain}, орбита ${req.orbitClass.toUpperCase()}, солнечная мощность ${req.solarArrayW} W.`
    : `Для запроса "${question}" базовая архитектура: ${options[0]?.name ?? req.vehicleScheme}, материал ${materialName(req.material)}, MTOW ${params.estimatedTakeoffMassKg} kg.`;

  return commonReport({
    active: stageName.ru[stage],
    decision: selectByStage(stage, {
      design: designDecision,
      manufacturing: `Рекомендуемый маршрут: ${materialName(req.material)}, процесс ${processName(req.manufacturingMethod)}, соединение ${req.jointMethod}.`,
      operations: req.vehicleDomain === 'spacecraft'
      ? `Эксплуатация: контролировать энергобаланс, связь ${params.linkQualityPercent}% и терморежим ${req.thermalControl}.`
      : `Эксплуатация: контролировать SoH ${req.batterySohPercent}%, RSSI ${req.linkRssiDbm} dBm и резерв RTH ${params.emergencyReservePercent}%.`,
    }),
    standards: selectByStage(stage, {
      design: req.vehicleDomain === 'spacecraft'
      ? 'NASA-STD-5001 и ECSS-E-ST применимы как база для прочности, нагрузок и верификации космических конструкций.'
      : 'FAA Part 107/ИКАО применимы для эксплуатации БПЛА; для прочности использовать NASA-STD-5001 как справочную инженерную базу.',
      manufacturing: 'ECSS-Q-ST-70C, ISO 9001/AS9100, ГОСТ 18353, ISO 2768-m использовать как базу производства и контроля.',
      operations: req.vehicleDomain === 'spacecraft'
      ? 'ECSS-E-ST-10-03C использовать для испытаний; FAA Part 107 не является основным нормативом для спутников.'
      : 'FAA Part 107, ИКАО и ГОСТ В 20.39.304 использовать для эксплуатационных ограничений и проверок.',
    }),
    params: `Мощность ${params.requiredPowerW} W, энергия ${params.requiredEnergyWh} Wh, MOS ${params.marginOfSafety}, риск ${params.riskLevel}.`,
    risks: 'Проверить, что выбранный класс аппарата, среда и режим миссии совпадают; не переносить правила БПЛА на спутники и наоборот.',
    language: 'ru',
  });
}

function buildKazakhReport(req: MissionRequirements, params: CalculatedParameters, options: DesignOption[], stage: EngineeringStage, question: string) {
  const designDecision = req.vehicleDomain === 'spacecraft'
    ? `"${question}" бойынша базалық сәулет: CubeSat/Satellite, орбита ${req.orbitClass.toUpperCase()}, күн панелі ${req.solarArrayW} W.`
    : `"${question}" бойынша базалық сәулет: ${options[0]?.name ?? req.vehicleScheme}, материал ${materialName(req.material)}, MTOW ${params.estimatedTakeoffMassKg} kg.`;

  return commonReport({
    active: stageName.kk[stage],
    decision: selectByStage(stage, {
      design: designDecision,
      manufacturing: `Өндірістік маршрут: ${materialName(req.material)}, процесс ${processName(req.manufacturingMethod)}, қосылыс ${req.jointMethod}.`,
      operations: `Пайдалану: байланыс ${params.linkQualityPercent}%, ресурс ${params.serviceLifeHours} h және anomaly ${params.anomalyStatus} бақылау.`,
    }),
    standards: selectByStage(stage, {
      design: 'NASA-STD-5001 және ECSS-E/ST нақты пунктсіз тек жалпы инженерлік негіз ретінде көрсетіледі.',
      manufacturing: 'ECSS-Q-ST-70C, ISO 9001/AS9100, ГОСТ 18353 және ISO 2768-m өндіріс пен бақылауға қатысты.',
      operations: 'ECSS-E-ST-10-03C, FAA Part 107/ICAO немесе ГОСТ нормалары аппарат класына қарай қолданылады.',
    }),
    params: `Қуат ${params.requiredPowerW} W, энергия ${params.requiredEnergyWh} Wh, MOS ${params.marginOfSafety}, тәуекел ${params.riskLevel}.`,
    risks: 'Аппарат класы, орта және миссия режимі сәйкес екенін тексеру керек.',
    language: 'kk',
  });
}

function buildEnglishReport(req: MissionRequirements, params: CalculatedParameters, options: DesignOption[], stage: EngineeringStage, question: string) {
  const designDecision = req.vehicleDomain === 'spacecraft'
    ? `For "${question}", use a CubeSat/Satellite baseline, ${req.orbitClass.toUpperCase()} orbit, ${req.solarArrayW} W solar array.`
    : `For "${question}", use ${options[0]?.name ?? req.vehicleScheme}, ${materialName(req.material)}, MTOW ${params.estimatedTakeoffMassKg} kg.`;

  return commonReport({
    active: stageName.en[stage],
    decision: selectByStage(stage, {
      design: designDecision,
      manufacturing: `Manufacturing route: ${materialName(req.material)}, ${processName(req.manufacturingMethod)}, joint ${req.jointMethod}.`,
      operations: `Operations: monitor link ${params.linkQualityPercent}%, service life ${params.serviceLifeHours} h, anomaly ${params.anomalyStatus}.`,
    }),
    standards: selectByStage(stage, {
      design: 'NASA-STD-5001 and ECSS-E/ST are relevant as general design and verification references unless exact clauses are available.',
      manufacturing: 'ECSS-Q-ST-70C, ISO 9001/AS9100, GOST 18353, and ISO 2768-m are relevant for process and inspection.',
      operations: 'ECSS-E-ST-10-03C, FAA Part 107/ICAO, or GOST references apply depending on vehicle domain.',
    }),
    params: `Power ${params.requiredPowerW} W, energy ${params.requiredEnergyWh} Wh, MOS ${params.marginOfSafety}, risk ${params.riskLevel}.`,
    risks: 'Verify that vehicle domain, environment, and mission mode match before applying standards.',
    language: 'en',
  });
}

function commonReport(data: {
  active: string;
  decision: string;
  standards: string;
  params: string;
  risks: string;
  language: Language;
}) {
  const unknown = data.language === 'ru' ? 'В имеющихся нормативных документах нет точной информации по пунктам/таблицам данного запроса.' : 'Exact clauses/tables are not available in the current context.';
  return `Этап: ${data.active}

Краткий вывод: ${data.decision}

Рекомендация: использовать выбранные параметры как предварительную инженерную оценку и уточнить их по паспорту материала, модели аппарата и требованиям миссии.

Расчётные параметры: ${data.params}

Стандарты: ${data.standards} ${unknown}

Риски: ${data.risks}`;
}

function selectByStage(stage: EngineeringStage, values: Record<EngineeringStage, string>) {
  return values[stage];
}

function materialName(material: string) {
  if (material === 'carbon') return 'CFRP';
  if (material === 'titanium') return 'Ti-6Al-4V';
  if (material === 'aluminum-7075') return 'Al 7075-T6';
  if (material === 'aluminum-2024') return 'Al 2024';
  return material;
}

function processName(process: string) {
  if (process === 'autoclave') return 'автоклавное формование';
  if (process === 'dmls') return 'DMLS additive manufacturing';
  if (process === 'cnc') return 'ЧПУ-фрезерование';
  return process;
}
